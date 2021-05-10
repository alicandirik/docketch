export namespace NoteActions {
  enum ActionTypes {
    GET = "[Note] Get",
    CURRENT = "[Note] Current",
    SET_CURRENT = "[Note] Set Current",
    NEW = '[Note] New',
    UPDATE = '[Note] Update',
    DELETE = '[Note] Delete',
    RESET = '[Note] Reset'
  }

  export class Get {
    static readonly type = ActionTypes.GET;

    constructor(public payload?: any, public isSearch = false) {}
  }

  export class SetCurrent {
    static readonly type = ActionTypes.SET_CURRENT;

    constructor(public payload?: any) {}
  }

  export class Current {
    static readonly type = ActionTypes.CURRENT;

    constructor(public id: string) {}
  }

  export class New {
    static readonly type = ActionTypes.NEW;

    constructor(public payload: any) {}
  }

  export class Update {
    static readonly type = ActionTypes.UPDATE;

    constructor(public payload: any) {}
  }

  export class Delete {
    static readonly type = ActionTypes.DELETE;

    constructor(public id: string) {}
  }

  export class Reset {
    static readonly type = ActionTypes.RESET;

    constructor(public field: string) {}
  }
}
