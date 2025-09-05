// DI 컨테이너 심볼 정의
export const TYPES = {
  // Auth
  userRepository: Symbol.for('UserRepository'),
  passwordHasher: Symbol.for('PasswordHasher'),
  registerUserUseCase: Symbol.for('RegisterUserUseCase'),
  loginUserUseCase: Symbol.for('LoginUserUseCase'),
  verifyEmailUseCase: Symbol.for('VerifyEmailUseCase'),
  
  // Todo
  todoRepository: Symbol.for('TodoRepository'),
  createTodoUseCase: Symbol.for('CreateTodoUseCase'),
  updateTodoUseCase: Symbol.for('UpdateTodoUseCase'),
  deleteTodoUseCase: Symbol.for('DeleteTodoUseCase'),
  getTodosUseCase: Symbol.for('GetTodosUseCase'),
};
