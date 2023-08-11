import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BatchesService } from 'src/app/_services/batches.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private batchService: BatchesService) { }

  ngOnInit(): void {
  }

  password = new FormControl("");

  login() {
    if(this.password.value === environment.password)
      this.batchService.login();
  }
}
