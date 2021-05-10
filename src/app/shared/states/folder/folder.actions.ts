export namespace FolderActions {
  enum ActionTypes {
    GET = "[Folder] Get",
    NEW = "[Folder] New",
    SET_CURRENT = "[Folder] Set Current",
    UPDATE = '[Folder] Update',
    DELETE = '[Folder] Delete',
    CURRENT = '[Folder] Current'
  }

  export class Get {
    static readonly type = ActionTypes.GET;

    constructor(public payload?: any, public isSearch: boolean = false) {}
  }

  export class New {
    static readonly type = ActionTypes.NEW;

    constructor(public payload?: any) {}
  }

  export class SetCurrent {
    static readonly type = ActionTypes.SET_CURRENT;

    constructor(public payload?: any) {}
  }

  export class Update {
    static readonly type = ActionTypes.UPDATE;

    constructor(public payload: any) {}
  }

  export class Delete {
    static readonly type = ActionTypes.DELETE;

    constructor(public folderId: string) {}
  }

  export class Current {
    static readonly type = ActionTypes.CURRENT;

    constructor(public id: string) {}
  }
}
