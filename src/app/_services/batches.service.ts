import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Batch } from '../_models/batch';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BatchesService {

  // public docId: string | undefined;

  constructor(private firestore: AngularFirestore) { }

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
      createdOn: date
    }
    this.firestore.collection<Batch>('batches').add(batch).then(() =>
      console.log("Batch success: Batch" + batchNum)
    ).catch((error) => console.log("failed: " + error))
  }
}