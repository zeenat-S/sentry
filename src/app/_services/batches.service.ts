import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Batch } from '../_models/batch';
import { Observable, map, tap } from 'rxjs';
import { Item } from '../_models/item';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BatchesService {

  sucess = false;
  // public docId: string | undefined;

  constructor(private firestore: AngularFirestore, private router: Router) { }

  async getBatch(batchNum: number): Promise<any> {
    try {
      const query = await this.firestore.collection<Batch>('batches', ref => ref.where('batchNum', '==', batchNum)).get().toPromise();
      if(query?.empty) {
        console.log("No document found");
        return;
      }
      const doc = query?.docs[0];
      const docId = doc?.id;
      return docId;
    } catch (error) {
      console.log("error getting batch Id: "+error)
    }
  }

  createBatch(batchNum: number) {
    const date = new Date().toLocaleDateString();
    const batch: Batch = {
      batchNum: batchNum,
      createdOn: date,
      packageAmount: 0
    }
    this.firestore.collection<Batch>('batches').add(batch).then(() =>
      console.log("Batch success: Batch" + batchNum)
    ).catch((error) => console.log("failed: " + error))
  }

  delete(batchNum: number) {
      const itemCollection = this.firestore.collection('batches', ref => ref.where('batchNum', '==', batchNum));
      itemCollection.get().toPromise().then(querySnapshot=>{
        querySnapshot?.forEach(doc=>{
          const itemRef = itemCollection.doc(doc.id);
          itemRef.delete();
        })
      })
  }

  deleteItem(ItemId: any, batchDocId: any) {
    const item = this.firestore.collection('batches').doc(batchDocId).collection('items', ref=> ref.where('itemId', '==', ItemId));
    item.get().toPromise().then(querySnapshot=>{
      querySnapshot?.forEach(doc=>{
        const itemRef = item.doc(doc.id);
        itemRef.delete();
      })
    })
  }

  updateItem(ItemId: any, batchDocId: any, newData: any) {
    const item = this.firestore.collection('batches').doc(batchDocId).collection('items', ref=>ref.where('itemId', '==', ItemId));
    item.get().toPromise().then(snapshot=>{
      snapshot?.forEach(doc=>{
        const itemRef = item.doc(doc.id)
        itemRef.update(newData);
      })
    })
  }

  login() {
    this.router.navigate(['/home']);
    this.sucess = true;
  }
}
