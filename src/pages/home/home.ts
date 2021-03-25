import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from "@ionic/storage";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
  ) {

  }

  buttons = [];

  add = false;
  trash = false;

  newTitle = "";
  newUrl = "";
  newColor = ""

  ngOnInit() {
    this.storage.get("allButtons").then((links) => {
      if (links) {
        this.buttons = links;
        return;
      }

      this.buttons = [
        { title: "Twitter", url: "https://www.twitter.com", color: "#1DA1F2" },
        { title: "Facebook", url: "https://www.facebook.com", color: "#4267B2" },
        { title: "Reddit", url: "https://www.reddit.com", color: "#FF4500" },
        { title: "Instagram", url: "https://www.instagram.com", color: "#E1306C" },
        { title: "LinkedIn", url: "https://www.linkedin.com", color: "#2867B2" },
        { title: "Messenger", url: "https://www.messenger.com", color: "#0078FF" }, //or #00C6FF
      ]
    })
  }

  buttonClick(url) {
    window.open(url, "_blank")
  }

  addButton() {
    this.buttons.push({ title: this.newTitle, url: this.newUrl, color: this.newColor ? this.newColor : "rgb(90 98 103)"})
    this.newColor = this.newTitle = this.newUrl = "";
    this.saveButtons();
    this.add = false;
  }

  toggleAdd() {
    this.add = !this.add;
  }

  toggleTrash() {
    this.trash = !this.trash;
  }

  trashItem(e, itemName) {
    e.stopPropagation();
    this.buttons = this.buttons.filter((item) => item.title !== itemName)
    this.saveButtons();
  }

  saveButtons() {
    this.storage.set("allButtons", this.buttons);
  }

}
