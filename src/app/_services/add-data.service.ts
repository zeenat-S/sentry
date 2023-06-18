import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Item } from '../_models/item';

@Injectable({
  providedIn: 'root'
})
export class AddDataService {

  constructor(private storage: AngularFireStorage, private firestore: AngularFirestore) { }


  addItem(item:Item, docId: string) {
    this.firestore.collection('batches').doc(docId).collection<Item>('items').add(item).then(()=>{
      console.log("success")
    }).catch(error => console.log(error))
  }

  uploadImage(image: File | null): any {
    const filePath = `images/${Date.now()}_${image?.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, image);
    let imageUrl = ""
    task.snapshotChanges().subscribe(
      (snapshot) => {
        if(snapshot?.state === 'success') {
          fileRef.getDownloadURL().subscribe((downloadUrl) => {
            imageUrl = downloadUrl;
          })
        }
      }
    )
  }
}
