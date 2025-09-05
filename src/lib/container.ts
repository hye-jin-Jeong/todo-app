import 'reflect-metadata';
import { Container } from 'inversify';
import { UserRepository } from '@/domain/auth/repositories';
import { PrismaUserRepository } from '@/infrastructure/auth/repositories';
import { PasswordHasher } from '@/infrastructure/auth/services';
import { 
  RegisterUserUseCase, 
  LoginUserUseCase, 
  VerifyEmailUseCase 
} from '@/application/auth/use-cases';
import { TodoRepository } from '@/domain/todo/repositories';
import { PrismaTodoRepository } from '@/infrastructure/todo/repositories';
import { 
  CreateTodoUseCase,
  UpdateTodoUseCase,
  DeleteTodoUseCase,
  GetTodosUseCase
} from '@/application/todo/use-cases';
import { TYPES } from './types';

// TYPES re-export
export { TYPES };

// 컨테이너 인스턴스 생성
export const container = new Container();

// 리포지토리 바인딩
container.bind<UserRepository>(TYPES.userRepository).to(PrismaUserRepository);
container.bind<TodoRepository>(TYPES.todoRepository).to(PrismaTodoRepository);

// 기술 서비스 바인딩
container.bind<PasswordHasher>(TYPES.passwordHasher).to(PasswordHasher);

// Auth 유스케이스 바인딩
container.bind<RegisterUserUseCase>(TYPES.registerUserUseCase).to(RegisterUserUseCase);
container.bind<LoginUserUseCase>(TYPES.loginUserUseCase).to(LoginUserUseCase);
container.bind<VerifyEmailUseCase>(TYPES.verifyEmailUseCase).to(VerifyEmailUseCase);

// Todo 유스케이스 바인딩
container.bind<CreateTodoUseCase>(TYPES.createTodoUseCase).to(CreateTodoUseCase);
container.bind<UpdateTodoUseCase>(TYPES.updateTodoUseCase).to(UpdateTodoUseCase);
container.bind<DeleteTodoUseCase>(TYPES.deleteTodoUseCase).to(DeleteTodoUseCase);
container.bind<GetTodosUseCase>(TYPES.getTodosUseCase).to(GetTodosUseCase);
