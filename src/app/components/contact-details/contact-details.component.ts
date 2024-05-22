import { Component, OnInit } from '@angular/core';
import { ContactInterface } from '../../services/contact.service';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class ContactDetailsComponent  implements OnInit {

  contacts: ContactInterface[] = [];

  constructor() { }

  ngOnInit() {}

}
