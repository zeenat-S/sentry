import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BatchesService } from 'src/app/_services/batches.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Item } from 'src/app/_models/item';
import { AddDataService } from 'src/app/_services/add-data.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Batch } from 'src/app/_models/batch';


@Component({
  selector: 'app-batch-detail',
  templateUrl: './batch-detail.component.html',
  styleUrls: ['./batch-detail.component.css']
})
export class BatchDetailComponent implements OnInit {

  batchNum !: number | null;
  batchDocID !: string;
  itemForm = new FormGroup({
    itemId: new FormControl(''),
    itemName: new FormControl(''),
    itemDesc: new FormControl(''),
    itemCP: new FormControl(),
    itemSP: new FormControl()
  })
  selectedImage: File | null = null;
  imageUrl: any
  items: Item[] = []
  addItem = false;

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage, private route: ActivatedRoute, private batchService: BatchesService, private add: AddDataService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.batchNum = params['batchNum'];
      this.getBatchID(this.batchNum);
    })
    this.batchService.getBatch(Number(this.batchNum)).then(id => {
      this.firestore.collection("batches").doc(id).collection<Item>('items').valueChanges().subscribe(data => {
        this.items = data;
      })
    })
  }

  show() {
    console.log(this.batchDocID)
  }

  getBatchID(num: number | null) {
    this.batchService.getBatch(Number(num)).then(docId => {
      this.batchDocID = docId;
      console.log(this.batchDocID);
    }).catch(error => {
      console.error('Error: ', error)
    })
  }

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  onSubmit() {
    if (this.selectedImage) {
      const filePath = `images/${Date.now()}_${this.selectedImage.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedImage);

      task.snapshotChanges().subscribe(
        (snapshot) => {
          if (snapshot?.state === 'success') {
            fileRef.getDownloadURL().subscribe((downloadUrl) => {
              this.imageUrl = downloadUrl;
              const item: Item = {
                itemId: String(this.itemForm.value.itemId),
                itemName: String(this.itemForm.value.itemName),
                itemDesc: String(this.itemForm.value.itemDesc),
                itemCP: Number(this.itemForm.value.itemCP),
                itemSP: Number(this.itemForm.value.itemSP),
                itemImage: this.imageUrl
              }
              this.add.addItem(item, this.batchDocID);
              console.log(this.batchDocID)
              console.log(this.imageUrl)
            });
          }
        },
        (error) => {
          console.error('Image upload failed: ', error);
        }
      )
    }
  }

  handleAddButton() {
    this.addItem = true
  }

  onClose() {
    this.addItem = false;
  }

  async openItem(itemId: string) {
    try {
      const query = await this.firestore.collection<Batch>('batches').doc(this.batchDocID).collection<Item>('items', ref => ref.where('itemId', '==', itemId)).get().toPromise();
      if(query?.empty) {
        console.log("No document found");
        return;
      }
      const doc = query?.docs[0];
      const docId = doc?.id
      console.log(docId);
      const batch = this.batchDocID
      this.router.navigate(['/item-details', docId, batch])
    } catch (error) {
      console.log("error getting batch Id: "+error)
    }
  }
}
