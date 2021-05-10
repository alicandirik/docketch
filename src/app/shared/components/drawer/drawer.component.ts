import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "app-drawer",
  templateUrl: "./drawer.component.html",
  styleUrls: ["./drawer.component.scss"],
})
export class DrawerComponent {
  @Input() visible = false;

  @Input() title = "";

  @Output() onClose: EventEmitter<boolean> = new EventEmitter();

  @ViewChild("content", { static: false }) content: any;

  close(): void {
    this.onClose.emit(true);
  }
}
