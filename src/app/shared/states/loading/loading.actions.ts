export namespace LoadingActions {
  enum ActionTypes {
    SHOW = "[Loading] Show",
    HIDE = "[Loading] Hide",
  }

  export class Show {
    static readonly type = ActionTypes.SHOW;

    constructor() {}
  }

  export class Hide {
    static readonly type = ActionTypes.HIDE;

    constructor() {}
  }
}
