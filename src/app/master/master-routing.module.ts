import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MasterComponent } from "./master.component";

const routes: Routes = [
  {
    path: "",
    component: MasterComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("../folder/folder.module").then((m) => m.FolderModule),
      },
      {
        path: ":folderId/notes",
        loadChildren: () =>
          import("../note-new/note-new.module").then((m) => m.NoteNewModule),
      },
      {
        path: ":folderId/notes/:noteId",
        loadChildren: () =>
          import("../note-new/note-new.module").then((m) => m.NoteNewModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule {}
