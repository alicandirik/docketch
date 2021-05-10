import { Component, OnInit } from "@angular/core";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";
import { LoadingState } from "../../states";

@Component({
  selector: "app-loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.scss"],
})
export class LoadingComponent implements OnInit {
  @Select(LoadingState.isLoading) isLoading$: Observable<boolean>;

  constructor() {}

  ngOnInit(): void {}
}
