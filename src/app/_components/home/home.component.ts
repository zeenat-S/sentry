import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {FormGroup, FormControl, Validators} from '@angular/forms';
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

  batchForm = new FormGroup(
    {
      batchNum : new FormControl('', Validators.required)
    }
  ) 

  constructor(private batchService: BatchesService, private firestore: AngularFirestore, private router: Router) { }

  ngOnInit(): void {
    this.firestore.collection<Batch>('batches').valueChanges().subscribe((batches)=> {
      this.batches = batches;
    })

  }

  createBatch() {
    this.batchService.createBatch(Number(this.batchForm.value.batchNum));
  }

  openBatch(batchNum: number): void {
    this.router.navigate(['/batch', batchNum]);
  }

}
