abstract class Login<T> {
  protected _username!: string;
  protected _secret!: T;

  get secret(): T {
    return this._secret;
  }
}

export default Login;
