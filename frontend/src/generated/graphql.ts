export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CreateProjectInput = {
  description: Scalars['String']['input'];
  featured?: Scalars['Boolean']['input'];
  githubUrl?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  liveUrl?: InputMaybe<Scalars['String']['input']>;
  techStack: Array<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  token: Scalars['String']['output'];
  user: User;
};

export type MutationRoot = {
  __typename?: 'MutationRoot';
  createProject: Project;
  createUser: User;
  deleteProject: Scalars['Int']['output'];
  loginUser: LoginResponse;
  updateMe: User;
  updateProject: Project;
};


export type MutationRootCreateProjectArgs = {
  newProject: CreateProjectInput;
};


export type MutationRootCreateUserArgs = {
  newUser: CreateUserInput;
};


export type MutationRootDeleteProjectArgs = {
  projectId: Scalars['String']['input'];
};


export type MutationRootLoginUserArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRootUpdateMeArgs = {
  user: UpdateUserInput;
};


export type MutationRootUpdateProjectArgs = {
  project: UpdateProjectInput;
};

export type Project = {
  __typename?: 'Project';
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  featured: Scalars['Boolean']['output'];
  githubUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  liveUrl?: Maybe<Scalars['String']['output']>;
  techStack: Array<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  getMe: User;
  getProject: Project;
  listProjects: Array<Project>;
};


export type QueryRootGetProjectArgs = {
  projectId: Scalars['String']['input'];
};

export type UpdateProjectInput = {
  content: CreateProjectInput;
  id: Scalars['String']['input'];
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};
