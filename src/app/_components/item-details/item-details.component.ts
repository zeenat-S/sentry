import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {

  itemDoc!: string |null| undefined;
  batch!: string |null| undefined;
  item!: any

  constructor(private route: ActivatedRoute,
    private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.itemDoc = this.route.snapshot.paramMap.get('docId');
    this.batch = this.route.snapshot.paramMap.get('batch')
    console.log(this.itemDoc, this.batch )
    if(this.batch!=undefined && this.itemDoc!=undefined) {
      this.firestore.collection('batches').doc(this.batch).collection('items').doc(this.itemDoc).valueChanges().subscribe(item => {
        this.item = item;
        console.log(this.item)
      })
    } 
  }

}
