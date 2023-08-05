import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BatchesService } from 'src/app/_services/batches.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Item } from 'src/app/_models/item';
import { AddDataService } from 'src/app/_services/add-data.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';




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
    itemSP: new FormControl(),
    quantity: new FormControl()
  })


  selectedImage: File | null = null;
  imageUrl: any
  items: Item[] = []
  addItem = false;
  totalSP = 0;
  totalCP = 0;
  totalProfit = 0;
  totalItems = 0

  constructor(private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private batchService: BatchesService,
    private add: AddDataService,
    private router: Router, 
    ) {
      this.route.params.subscribe((params) => {
        this.batchNum = params['batchNum'];
        this.getBatchID(this.batchNum);
      })
      this.batchService.getBatch(Number(this.batchNum)).then(id => {
        this.firestore.collection("batches").doc(id).collection<Item>('items').valueChanges().subscribe(data => {
          this.items = data;
          for ( let item of data) {
            this.totalCP += item.itemCPTotal;
            this.totalSP += item.itemSPTotal;
            this.totalItems += Number(item.quantity);
          }
          data.sort(function(a, b) {
            var textA = a.itemId.toUpperCase();
            var textB = b.itemId.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
          this.totalProfit = this.totalSP - this.totalCP;
        })
      })
  }

  ngOnInit(): void {
   
    
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
              const sp = Number(this.itemForm.value.itemSP)
              const cp = Number(this.itemForm.value.itemCP)
              const quant = Number(this.itemForm.value.quantity)
              const item: Item = {
                itemId: String(this.itemForm.value.itemId),
                itemName: String(this.itemForm.value.itemName),
                itemDesc: String(this.itemForm.value.itemDesc),
                itemCPSingle: cp,
                itemSPSingle: sp,
                itemImage: this.imageUrl,
                quantity: quant,
                itemCPTotal: cp * quant,
                itemSPTotal: sp * quant
              }
              this.add.addItem(item, this.batchDocID);
              console.log(this.batchDocID)
              console.log(this.imageUrl)
              this.itemForm.reset();
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

  delete(itemId: any) {
    this.batchService.deleteItem(itemId, this.batchDocID)
    this.refreshPage()
  }

  refreshPage(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    const currentUrl = this.router.url + '?';
    this.router.navigateByUrl(currentUrl)
      .then(() => {
        this.router.navigated = false;
        this.router.navigateByUrl(this.router.url);
      });
  }

  
  id = new FormControl("");
  desc = new FormControl("");
  cps = new FormControl();
  sps = new FormControl();
  quant = new FormControl();
 
  openEdit = false
  idEdit !: string
  edit(id: any) {
    this.idEdit = id
    this.openEdit = !this.openEdit
  }

  save(itemId: any, batchID: any) {
    this.batchService.updateItem(itemId, batchID, {
      itemDesc: this.desc.value,
      itemCPSingle: this.cps.value,
      itemSPSingle: this.sps.value,
      quantity: this.quant.value,
      itemCPTotal: this.cps.value * this.quant.value,
      itemSPTotal: this.sps.value * this.quant.value
    })
    this.desc.reset();
    this.cps.reset();
    this.sps.reset();
    this.quant.reset();
    this.openEdit = !this.openEdit;
  }
  
  print() {
    window.print();
  }

}
