import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Batch } from 'src/app/_models/batch';
import { BatchesService } from 'src/app/_services/batches.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  batches!: Batch[];
  docId!: string;
  batchNum = 0;
  loggedIn = this.batchService.sucess

  constructor(private batchService: BatchesService, private firestore: AngularFirestore, private router: Router) {
    this.firestore.collection<Batch>('batches').valueChanges().subscribe((batches) => {
      this.batches = batches;
      batches.sort(function (a, b) {
        var textA = a.batchNum;
        var textB = b.batchNum;
        return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
      })
    })
  }

  ngOnInit(): void {
  }

  createBatch() {
    if (this.loggedIn) {
      this.batchNum = this.batches.length + 1;
      this.batchService.createBatch(Number(this.batchNum));
    }
    if (!this.loggedIn)
      window.alert("Not Logged In")
  }

  openBatch(batchNum: number): void {
    if (this.loggedIn)
      this.router.navigate(['/batch', batchNum]);

    if (!this.loggedIn)
      window.alert("Not Logged In")
  }

  deleteBatch(batchNum: number) {
    if (this.loggedIn) {
      this.batchService.delete(batchNum)
    }
    if (!this.loggedIn)
    window.alert("Not Logged In")
  }
}
