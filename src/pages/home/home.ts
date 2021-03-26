import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    [
      trigger("inputsFade", [
        transition(":enter", [
          style({ margin: 0, height: 0, transform: "scale(.8)", opacity: 0 }),
          animate(
            ".35s ease-in-out",
            style({ height: "199px", transform: "scale(1)", opacity: 1 })
          ),
        ]),
        transition(":leave", [
          style({ opacity: 1, height: "199px", }),
          animate(
            ".35s ease-in-out",
            style({
              transform: "scale(.8)", opacity: 0, height: 0, margin: 0,
            })
          ),
        ]),
      ]),
    ],
    [
      trigger("fadeAnimation", [
        transition(":enter", [
          style({ opacity: 0 }),
          animate(
            ".1s ease-out",
            style({ opacity: 1 })
          ),
        ]),
        transition(":leave", [
          style({ opacity: 1 }),
          animate(
            ".1s ease-out",
            style({
              opacity: 0,
            })
          ),
        ]),
      ]),
    ],
    [
      trigger("cardAnimation", [
        transition("* => *", [
          query(":enter", style({ opacity: 0 }), { optional: true }),
          query(
            ":enter",
            stagger("45ms", [
              animate(
                ".5s ease-in",
                keyframes([
                  style({
                    opacity: 0,
                    transform: "translateY(-10px) scale(1.05)",
                    offset: 0,
                  }),
                  style({
                    opacity: 0.5,
                    transform: "translateY(-5px) scale(1)",
                    offset: 0.3,
                  }),
                  style({ opacity: 1, transform: "translateY(0)", offset: 1 }),
                ])
              ),
            ]),
            { optional: true }
          ),
        ]),
      ]),
    ],
  ],
})
export class HomePage implements OnInit {

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private iab: InAppBrowser
  ) {

  }

  buttons = [];

  add = false;
  trash = false;

  newTitle = "";
  newUrl = "";
  newColor = ""

  webView = false;

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
      ]
    })

    this.storage.get("webView").then((webView) => {
      if (webView === "false") {
        this.webView = false;
      } else if (webView === "true") {
        this.webView = true;
      } else {
        this.storage.set("webView", "false");
      }
    })
  }

  buttonClick(url) {
    if (!this.webView) {
      this.iab.create(url, "_system");
      return
    }

    let options = "location=yes,hardwareback=yes,clearsessioncache=yes,clearcache=no,footer=no,hideurlbar=yes,zoom=no"
    this.iab.create(url, "_blank", options);
  }

  addButton() {
    this.buttons.push({ title: this.newTitle, url: this.newUrl, color: this.newColor ? this.newColor : "rgb(90 98 103)" })
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

  toggleWebview() {
    this.webView = !this.webView;
    this.storage.set("webView", this.webView ? "true" : "false");
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
