export namespace UserActions {
  enum ActionTypes {
    REGISTER = "[User] Register",
    LOGIN = "[User] Login",
    ME = "[User] Me",
    SET_USER = "[User] Set",
  }

  export class Register {
    static readonly type = ActionTypes.REGISTER;

    constructor(public payload: any) {}
  }

  export class Login {
    static readonly type = ActionTypes.LOGIN;

    constructor(public payload: any) {}
  }

  export class Me {
    static readonly type = ActionTypes.ME;

    constructor() {}
  }

  export class SetUser {
    static readonly type = ActionTypes.SET_USER;

    constructor(public payload: any) {}
  }
}
