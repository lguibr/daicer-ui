import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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

export type CharacterBlueprint = {
  __typename?: 'CharacterBlueprint';
  blueprintId: Scalars['ID']['output'];
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CreateRoomInput = {
  language: Scalars['String']['input'];
  requestId: Scalars['ID']['input'];
  worldConfig: GameWorldConfigInput;
};

export type GameAttributes = {
  __typename?: 'GameAttributes';
  charisma: Scalars['Int']['output'];
  constitution: Scalars['Int']['output'];
  dexterity: Scalars['Int']['output'];
  intelligence: Scalars['Int']['output'];
  strength: Scalars['Int']['output'];
  wisdom: Scalars['Int']['output'];
};

export type GameCapabilities = {
  __typename?: 'GameCapabilities';
  canResolve: Scalars['Boolean']['output'];
  canStart: Scalars['Boolean']['output'];
  canSubmit: Scalars['Boolean']['output'];
};

export type GameEntityView = {
  __typename?: 'GameEntityView';
  ac: Scalars['Int']['output'];
  blueprintId?: Maybe<Scalars['ID']['output']>;
  characterSheetId: Scalars['ID']['output'];
  currentHp: Scalars['Int']['output'];
  maxHp: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  position?: Maybe<GamePosition>;
  stats?: Maybe<GameAttributes>;
  type: Scalars['String']['output'];
};

export enum GameMessageAudience {
  Room = 'room',
  Self = 'self'
}

export type GameMessagePage = {
  __typename?: 'GameMessagePage';
  nodes: Array<GameMessageView>;
  pageInfo: GameMessagePageInfo;
};

export type GameMessagePageInfo = {
  __typename?: 'GameMessagePageInfo';
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type GameMessageView = {
  __typename?: 'GameMessageView';
  audience: GameMessageAudience;
  content: Scalars['String']['output'];
  messageId: Scalars['ID']['output'];
  senderName: Scalars['String']['output'];
  senderType: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
  turnNumber?: Maybe<Scalars['Int']['output']>;
};

export enum GameOperationStatus {
  Complete = 'complete',
  Failed = 'failed',
  Running = 'running'
}

export type GamePlayerView = {
  __typename?: 'GamePlayerView';
  characterName?: Maybe<Scalars['String']['output']>;
  characterSheetId?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
  ready: Scalars['Boolean']['output'];
  submitted: Scalars['Boolean']['output'];
  userId: Scalars['ID']['output'];
};

export type GamePosition = {
  __typename?: 'GamePosition';
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
  z: Scalars['Int']['output'];
};

export enum GameRoomPhase {
  CharacterCreation = 'character_creation',
  Combat = 'combat',
  Ended = 'ended',
  Ending = 'ending',
  Gameplay = 'gameplay',
  Lobby = 'lobby',
  Starting = 'starting',
  WorldGeneration = 'world_generation'
}

export enum GameSubmissionKind {
  Intent = 'intent',
  Pass = 'pass'
}

export enum GameSubmissionStatus {
  NeedsRevision = 'needs_revision',
  Proposing = 'proposing',
  Resolved = 'resolved',
  Submitted = 'submitted'
}

export type GameSubmissionView = {
  __typename?: 'GameSubmissionView';
  feedback?: Maybe<Scalars['String']['output']>;
  kind: GameSubmissionKind;
  status: GameSubmissionStatus;
  submissionId: Scalars['ID']['output'];
  text?: Maybe<Scalars['String']['output']>;
  turnNumber: Scalars['Int']['output'];
};

export type GameTerrainTile = {
  __typename?: 'GameTerrainTile';
  biome: Scalars['String']['output'];
  block: Scalars['String']['output'];
  isTransparent: Scalars['Boolean']['output'];
  isWalkable: Scalars['Boolean']['output'];
  x: Scalars['Int']['output'];
  y: Scalars['Int']['output'];
  z: Scalars['Int']['output'];
};

export type GameTerrainView = {
  __typename?: 'GameTerrainView';
  chunkSize: Scalars['Int']['output'];
  maxZ: Scalars['Int']['output'];
  minZ: Scalars['Int']['output'];
  revision: Scalars['String']['output'];
  tiles: Array<GameTerrainTile>;
  worldId: Scalars['ID']['output'];
};

export enum GameTurnStatus {
  Collecting = 'collecting',
  Resolving = 'resolving'
}

export type GameTurnView = {
  __typename?: 'GameTurnView';
  lastResolvedNumber: Scalars['Int']['output'];
  number: Scalars['Int']['output'];
  requiredCount: Scalars['Int']['output'];
  status: GameTurnStatus;
  submittedCount: Scalars['Int']['output'];
};

export type GameWorldConfig = {
  __typename?: 'GameWorldConfig';
  chunkSize: Scalars['Int']['output'];
  detail: Scalars['Int']['output'];
  elevationScale: Scalars['Float']['output'];
  fogRadius: Scalars['Int']['output'];
  globalScale: Scalars['Float']['output'];
  moistureScale: Scalars['Float']['output'];
  roadDensity: Scalars['Float']['output'];
  roughness: Scalars['Float']['output'];
  seaLevel: Scalars['Float']['output'];
  seed: Scalars['String']['output'];
  structureChance: Scalars['Float']['output'];
  structureSizeAvg: Scalars['Int']['output'];
  structureSpacing: Scalars['Int']['output'];
  temperatureOffset: Scalars['Float']['output'];
  worldSize: Scalars['String']['output'];
  worldType: Scalars['String']['output'];
};

export type GameWorldConfigInput = {
  chunkSize?: InputMaybe<Scalars['Int']['input']>;
  detail?: InputMaybe<Scalars['Int']['input']>;
  elevationScale?: InputMaybe<Scalars['Float']['input']>;
  fogRadius?: InputMaybe<Scalars['Int']['input']>;
  globalScale?: InputMaybe<Scalars['Float']['input']>;
  moistureScale?: InputMaybe<Scalars['Float']['input']>;
  roadDensity?: InputMaybe<Scalars['Float']['input']>;
  roughness?: InputMaybe<Scalars['Float']['input']>;
  seaLevel?: InputMaybe<Scalars['Float']['input']>;
  seed: Scalars['String']['input'];
  structureChance?: InputMaybe<Scalars['Float']['input']>;
  structureSizeAvg?: InputMaybe<Scalars['Int']['input']>;
  structureSpacing?: InputMaybe<Scalars['Int']['input']>;
  temperatureOffset?: InputMaybe<Scalars['Float']['input']>;
  worldSize?: InputMaybe<Scalars['String']['input']>;
  worldType?: InputMaybe<Scalars['String']['input']>;
};

export type GameWorldView = {
  __typename?: 'GameWorldView';
  config: GameWorldConfig;
  description: Scalars['String']['output'];
  language: Scalars['String']['output'];
  worldId: Scalars['ID']['output'];
};

export type JoinRoomInput = {
  code: Scalars['String']['input'];
  requestId: Scalars['ID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createRoom: RoomView;
  joinRoom: RoomView;
  resolveTurn: RoomOperation;
  selectCharacter: RoomView;
  setReady: RoomView;
  startGame: RoomOperation;
  submitAction: SubmissionReceipt;
};


export type MutationCreateRoomArgs = {
  input: CreateRoomInput;
};


export type MutationJoinRoomArgs = {
  input: JoinRoomInput;
};


export type MutationResolveTurnArgs = {
  input: ResolveTurnInput;
};


export type MutationSelectCharacterArgs = {
  input: SelectCharacterInput;
};


export type MutationSetReadyArgs = {
  input: SetReadyInput;
};


export type MutationStartGameArgs = {
  input: RoomOperationInput;
};


export type MutationSubmitActionArgs = {
  input: SubmitActionInput;
};

export type Query = {
  __typename?: 'Query';
  characterBlueprints: Array<CharacterBlueprint>;
  gameMessages: GameMessagePage;
  gameView: RoomView;
  myRooms: Array<RoomSummary>;
};


export type QueryGameMessagesArgs = {
  before?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  roomId: Scalars['ID']['input'];
};


export type QueryGameViewArgs = {
  roomId: Scalars['ID']['input'];
};

export type ResolveTurnInput = {
  requestId: Scalars['ID']['input'];
  roomId: Scalars['ID']['input'];
  turnNumber: Scalars['Int']['input'];
};

export type RoomOperation = {
  __typename?: 'RoomOperation';
  operationId: Scalars['ID']['output'];
  phase: GameRoomPhase;
  roomId: Scalars['ID']['output'];
  status: GameOperationStatus;
  turnNumber?: Maybe<Scalars['Int']['output']>;
};

export type RoomOperationInput = {
  requestId: Scalars['ID']['input'];
  roomId: Scalars['ID']['input'];
};

export type RoomSummary = {
  __typename?: 'RoomSummary';
  code: Scalars['String']['output'];
  ownerUserId: Scalars['ID']['output'];
  phase: GameRoomPhase;
  roomId: Scalars['ID']['output'];
};

export type RoomView = {
  __typename?: 'RoomView';
  capabilities: GameCapabilities;
  code: Scalars['String']['output'];
  messages: GameMessagePage;
  mySubmission?: Maybe<GameSubmissionView>;
  myself?: Maybe<GameEntityView>;
  ownerUserId: Scalars['ID']['output'];
  phase: GameRoomPhase;
  players: Array<GamePlayerView>;
  revision: Scalars['Int']['output'];
  roomId: Scalars['ID']['output'];
  terrain?: Maybe<GameTerrainView>;
  turn?: Maybe<GameTurnView>;
  visibleEntities: Array<GameEntityView>;
  world: GameWorldView;
};

export type SelectCharacterInput = {
  blueprintId: Scalars['ID']['input'];
  requestId: Scalars['ID']['input'];
  roomId: Scalars['ID']['input'];
};

export type SetReadyInput = {
  ready: Scalars['Boolean']['input'];
  requestId: Scalars['ID']['input'];
  roomId: Scalars['ID']['input'];
};

export type SubmissionReceipt = {
  __typename?: 'SubmissionReceipt';
  requiredCount: Scalars['Int']['output'];
  status: GameSubmissionStatus;
  submissionId: Scalars['ID']['output'];
  submittedCount: Scalars['Int']['output'];
  turnNumber: Scalars['Int']['output'];
};

export type SubmitActionInput = {
  kind: GameSubmissionKind;
  requestId: Scalars['ID']['input'];
  roomId: Scalars['ID']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
  turnNumber: Scalars['Int']['input'];
};

export type PlayerEntityFragment = { __typename?: 'GameEntityView', characterSheetId: string, blueprintId?: string | null, name: string, type: string, currentHp: number, maxHp: number, ac: number, position?: { __typename?: 'GamePosition', x: number, y: number, z: number } | null, stats?: { __typename?: 'GameAttributes', strength: number, dexterity: number, constitution: number, intelligence: number, wisdom: number, charisma: number } | null };

export type PlayerRoomFragment = { __typename?: 'RoomView', roomId: string, code: string, phase: GameRoomPhase, revision: number, ownerUserId: string, world: { __typename?: 'GameWorldView', worldId: string, language: string, description: string, config: { __typename?: 'GameWorldConfig', seed: string, chunkSize: number, detail: number, fogRadius: number, globalScale: number, seaLevel: number, elevationScale: number, roughness: number, moistureScale: number, temperatureOffset: number, roadDensity: number, structureChance: number, structureSpacing: number, structureSizeAvg: number, worldSize: string, worldType: string } }, players: Array<{ __typename?: 'GamePlayerView', userId: string, name: string, characterSheetId?: string | null, characterName?: string | null, ready: boolean, submitted: boolean }>, myself?: { __typename?: 'GameEntityView', characterSheetId: string, blueprintId?: string | null, name: string, type: string, currentHp: number, maxHp: number, ac: number, position?: { __typename?: 'GamePosition', x: number, y: number, z: number } | null, stats?: { __typename?: 'GameAttributes', strength: number, dexterity: number, constitution: number, intelligence: number, wisdom: number, charisma: number } | null } | null, turn?: { __typename?: 'GameTurnView', number: number, status: GameTurnStatus, lastResolvedNumber: number, submittedCount: number, requiredCount: number } | null, mySubmission?: { __typename?: 'GameSubmissionView', submissionId: string, turnNumber: number, kind: GameSubmissionKind, text?: string | null, status: GameSubmissionStatus, feedback?: string | null } | null, visibleEntities: Array<{ __typename?: 'GameEntityView', characterSheetId: string, blueprintId?: string | null, name: string, type: string, currentHp: number, maxHp: number, ac: number, position?: { __typename?: 'GamePosition', x: number, y: number, z: number } | null, stats?: { __typename?: 'GameAttributes', strength: number, dexterity: number, constitution: number, intelligence: number, wisdom: number, charisma: number } | null }>, terrain?: { __typename?: 'GameTerrainView', worldId: string, revision: string, chunkSize: number, minZ: number, maxZ: number, tiles: Array<{ __typename?: 'GameTerrainTile', x: number, y: number, z: number, block: string, biome: string, isWalkable: boolean, isTransparent: boolean }> } | null, messages: { __typename?: 'GameMessagePage', nodes: Array<{ __typename?: 'GameMessageView', messageId: string, turnNumber?: number | null, audience: GameMessageAudience, content: string, senderName: string, senderType: string, timestamp: string }>, pageInfo: { __typename?: 'GameMessagePageInfo', hasPreviousPage: boolean, startCursor?: string | null } }, capabilities: { __typename?: 'GameCapabilities', canStart: boolean, canSubmit: boolean, canResolve: boolean } };

export type PlayerRoomQueryVariables = Exact<{
  roomId: Scalars['ID']['input'];
}>;


export type PlayerRoomQuery = { __typename?: 'Query', gameView: { __typename?: 'RoomView', roomId: string, code: string, phase: GameRoomPhase, revision: number, ownerUserId: string, world: { __typename?: 'GameWorldView', worldId: string, language: string, description: string, config: { __typename?: 'GameWorldConfig', seed: string, chunkSize: number, detail: number, fogRadius: number, globalScale: number, seaLevel: number, elevationScale: number, roughness: number, moistureScale: number, temperatureOffset: number, roadDensity: number, structureChance: number, structureSpacing: number, structureSizeAvg: number, worldSize: string, worldType: string } }, players: Array<{ __typename?: 'GamePlayerView', userId: string, name: string, characterSheetId?: string | null, characterName?: string | null, ready: boolean, submitted: boolean }>, myself?: { __typename?: 'GameEntityView', characterSheetId: string, blueprintId?: string | null, name: string, type: string, currentHp: number, maxHp: number, ac: number, position?: { __typename?: 'GamePosition', x: number, y: number, z: number } | null, stats?: { __typename?: 'GameAttributes', strength: number, dexterity: number, constitution: number, intelligence: number, wisdom: number, charisma: number } | null } | null, turn?: { __typename?: 'GameTurnView', number: number, status: GameTurnStatus, lastResolvedNumber: number, submittedCount: number, requiredCount: number } | null, mySubmission?: { __typename?: 'GameSubmissionView', submissionId: string, turnNumber: number, kind: GameSubmissionKind, text?: string | null, status: GameSubmissionStatus, feedback?: string | null } | null, visibleEntities: Array<{ __typename?: 'GameEntityView', characterSheetId: string, blueprintId?: string | null, name: string, type: string, currentHp: number, maxHp: number, ac: number, position?: { __typename?: 'GamePosition', x: number, y: number, z: number } | null, stats?: { __typename?: 'GameAttributes', strength: number, dexterity: number, constitution: number, intelligence: number, wisdom: number, charisma: number } | null }>, terrain?: { __typename?: 'GameTerrainView', worldId: string, revision: string, chunkSize: number, minZ: number, maxZ: number, tiles: Array<{ __typename?: 'GameTerrainTile', x: number, y: number, z: number, block: string, biome: string, isWalkable: boolean, isTransparent: boolean }> } | null, messages: { __typename?: 'GameMessagePage', nodes: Array<{ __typename?: 'GameMessageView', messageId: string, turnNumber?: number | null, audience: GameMessageAudience, content: string, senderName: string, senderType: string, timestamp: string }>, pageInfo: { __typename?: 'GameMessagePageInfo', hasPreviousPage: boolean, startCursor?: string | null } }, capabilities: { __typename?: 'GameCapabilities', canStart: boolean, canSubmit: boolean, canResolve: boolean } } };

export type PlayerRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type PlayerRoomsQuery = { __typename?: 'Query', myRooms: Array<{ __typename?: 'RoomSummary', roomId: string, code: string, phase: GameRoomPhase, ownerUserId: string }> };

export type PlayerBlueprintsQueryVariables = Exact<{ [key: string]: never; }>;


export type PlayerBlueprintsQuery = { __typename?: 'Query', characterBlueprints: Array<{ __typename?: 'CharacterBlueprint', blueprintId: string, name: string, description: string }> };

export type PlayerMessagesQueryVariables = Exact<{
  roomId: Scalars['ID']['input'];
  before?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
}>;


export type PlayerMessagesQuery = { __typename?: 'Query', gameMessages: { __typename?: 'GameMessagePage', nodes: Array<{ __typename?: 'GameMessageView', messageId: string, turnNumber?: number | null, audience: GameMessageAudience, content: string, senderName: string, senderType: string, timestamp: string }>, pageInfo: { __typename?: 'GameMessagePageInfo', hasPreviousPage: boolean, startCursor?: string | null } } };

export type PlayerCreateRoomMutationVariables = Exact<{
  input: CreateRoomInput;
}>;


export type PlayerCreateRoomMutation = { __typename?: 'Mutation', createRoom: { __typename?: 'RoomView', roomId: string, code: string, phase: GameRoomPhase, revision: number, ownerUserId: string, world: { __typename?: 'GameWorldView', worldId: string, language: string, description: string, config: { __typename?: 'GameWorldConfig', seed: string, chunkSize: number, detail: number, fogRadius: number, globalScale: number, seaLevel: number, elevationScale: number, roughness: number, moistureScale: number, temperatureOffset: number, roadDensity: number, structureChance: number, structureSpacing: number, structureSizeAvg: number, worldSize: string, worldType: string } }, players: Array<{ __typename?: 'GamePlayerView', userId: string, name: string, characterSheetId?: string | null, characterName?: string | null, ready: boolean, submitted: boolean }>, myself?: { __typename?: 'GameEntityView', characterSheetId: string, blueprintId?: string | null, name: string, type: string, currentHp: number, maxHp: number, ac: number, position?: { __typename?: 'GamePosition', x: number, y: number, z: number } | null, stats?: { __typename?: 'GameAttributes', strength: number, dexterity: number, constitution: number, intelligence: number, wisdom: number, charisma: number } | null } | null, turn?: { __typename?: 'GameTurnView', number: number, status: GameTurnStatus, lastResolvedNumber: number, submittedCount: number, requiredCount: number } | null, mySubmission?: { __typename?: 'GameSubmissionView', submissionId: string, turnNumber: number, kind: GameSubmissionKind, text?: string | null, status: GameSubmissionStatus, feedback?: string | null } | null, visibleEntities: Array<{ __typename?: 'GameEntityView', characterSheetId: string, blueprintId?: string | null, name: string, type: string, currentHp: number, maxHp: number, ac: number, position?: { __typename?: 'GamePosition', x: number, y: number, z: number } | null, stats?: { __typename?: 'GameAttributes', strength: number, dexterity: number, constitution: number, intelligence: number, wisdom: number, charisma: number } | null }>, terrain?: { __typename?: 'GameTerrainView', worldId: string, revision: string, chunkSize: number, minZ: number, maxZ: number, tiles: Array<{ __typename?: 'GameTerrainTile', x: number, y: number, z: number, block: string, biome: string, isWalkable: boolean, isTransparent: boolean }> } | null, messages: { __typename?: 'GameMessagePage', nodes: Array<{ __typename?: 'GameMessageView', messageId: string, turnNumber?: number | null, audience: GameMessageAudience, content: string, senderName: string, senderType: string, timestamp: string }>, pageInfo: { __typename?: 'GameMessagePageInfo', hasPreviousPage: boolean, startCursor?: string | null } }, capabilities: { __typename?: 'GameCapabilities', canStart: boolean, canSubmit: boolean, canResolve: boolean } } };

export type PlayerJoinRoomMutationVariables = Exact<{
  input: JoinRoomInput;
}>;


export type PlayerJoinRoomMutation = { __typename?: 'Mutation', joinRoom: { __typename?: 'RoomView', roomId: string, code: string, phase: GameRoomPhase, revision: number, ownerUserId: string, world: { __typename?: 'GameWorldView', worldId: string, language: string, description: string, config: { __typename?: 'GameWorldConfig', seed: string, chunkSize: number, detail: number, fogRadius: number, globalScale: number, seaLevel: number, elevationScale: number, roughness: number, moistureScale: number, temperatureOffset: number, roadDensity: number, structureChance: number, structureSpacing: number, structureSizeAvg: number, worldSize: string, worldType: string } }, players: Array<{ __typename?: 'GamePlayerView', userId: string, name: string, characterSheetId?: string | null, characterName?: string | null, ready: boolean, submitted: boolean }>, myself?: { __typename?: 'GameEntityView', characterSheetId: string, blueprintId?: string | null, name: string, type: string, currentHp: number, maxHp: number, ac: number, position?: { __typename?: 'GamePosition', x: number, y: number, z: number } | null, stats?: { __typename?: 'GameAttributes', strength: number, dexterity: number, constitution: number, intelligence: number, wisdom: number, charisma: number } | null } | null, turn?: { __typename?: 'GameTurnView', number: number, status: GameTurnStatus, lastResolvedNumber: number, submittedCount: number, requiredCount: number } | null, mySubmission?: { __typename?: 'GameSubmissionView', submissionId: string, turnNumber: number, kind: GameSubmissionKind, text?: string | null, status: GameSubmissionStatus, feedback?: string | null } | null, visibleEntities: Array<{ __typename?: 'GameEntityView', characterSheetId: string, blueprintId?: string | null, name: string, type: string, currentHp: number, maxHp: number, ac: number, position?: { __typename?: 'GamePosition', x: number, y: number, z: number } | null, stats?: { __typename?: 'GameAttributes', strength: number, dexterity: number, constitution: number, intelligence: number, wisdom: number, charisma: number } | null }>, terrain?: { __typename?: 'GameTerrainView', worldId: string, revision: string, chunkSize: number, minZ: number, maxZ: number, tiles: Array<{ __typename?: 'GameTerrainTile', x: number, y: number, z: number, block: string, biome: string, isWalkable: boolean, isTransparent: boolean }> } | null, messages: { __typename?: 'GameMessagePage', nodes: Array<{ __typename?: 'GameMessageView', messageId: string, turnNumber?: number | null, audience: GameMessageAudience, content: string, senderName: string, senderType: string, timestamp: string }>, pageInfo: { __typename?: 'GameMessagePageInfo', hasPreviousPage: boolean, startCursor?: string | null } }, capabilities: { __typename?: 'GameCapabilities', canStart: boolean, canSubmit: boolean, canResolve: boolean } } };

export type PlayerSelectCharacterMutationVariables = Exact<{
  input: SelectCharacterInput;
}>;


export type PlayerSelectCharacterMutation = { __typename?: 'Mutation', selectCharacter: { __typename?: 'RoomView', roomId: string, code: string, phase: GameRoomPhase, revision: number, ownerUserId: string, world: { __typename?: 'GameWorldView', worldId: string, language: string, description: string, config: { __typename?: 'GameWorldConfig', seed: string, chunkSize: number, detail: number, fogRadius: number, globalScale: number, seaLevel: number, elevationScale: number, roughness: number, moistureScale: number, temperatureOffset: number, roadDensity: number, structureChance: number, structureSpacing: number, structureSizeAvg: number, worldSize: string, worldType: string } }, players: Array<{ __typename?: 'GamePlayerView', userId: string, name: string, characterSheetId?: string | null, characterName?: string | null, ready: boolean, submitted: boolean }>, myself?: { __typename?: 'GameEntityView', characterSheetId: string, blueprintId?: string | null, name: string, type: string, currentHp: number, maxHp: number, ac: number, position?: { __typename?: 'GamePosition', x: number, y: number, z: number } | null, stats?: { __typename?: 'GameAttributes', strength: number, dexterity: number, constitution: number, intelligence: number, wisdom: number, charisma: number } | null } | null, turn?: { __typename?: 'GameTurnView', number: number, status: GameTurnStatus, lastResolvedNumber: number, submittedCount: number, requiredCount: number } | null, mySubmission?: { __typename?: 'GameSubmissionView', submissionId: string, turnNumber: number, kind: GameSubmissionKind, text?: string | null, status: GameSubmissionStatus, feedback?: string | null } | null, visibleEntities: Array<{ __typename?: 'GameEntityView', characterSheetId: string, blueprintId?: string | null, name: string, type: string, currentHp: number, maxHp: number, ac: number, position?: { __typename?: 'GamePosition', x: number, y: number, z: number } | null, stats?: { __typename?: 'GameAttributes', strength: number, dexterity: number, constitution: number, intelligence: number, wisdom: number, charisma: number } | null }>, terrain?: { __typename?: 'GameTerrainView', worldId: string, revision: string, chunkSize: number, minZ: number, maxZ: number, tiles: Array<{ __typename?: 'GameTerrainTile', x: number, y: number, z: number, block: string, biome: string, isWalkable: boolean, isTransparent: boolean }> } | null, messages: { __typename?: 'GameMessagePage', nodes: Array<{ __typename?: 'GameMessageView', messageId: string, turnNumber?: number | null, audience: GameMessageAudience, content: string, senderName: string, senderType: string, timestamp: string }>, pageInfo: { __typename?: 'GameMessagePageInfo', hasPreviousPage: boolean, startCursor?: string | null } }, capabilities: { __typename?: 'GameCapabilities', canStart: boolean, canSubmit: boolean, canResolve: boolean } } };

export type PlayerSetReadyMutationVariables = Exact<{
  input: SetReadyInput;
}>;


export type PlayerSetReadyMutation = { __typename?: 'Mutation', setReady: { __typename?: 'RoomView', roomId: string, code: string, phase: GameRoomPhase, revision: number, ownerUserId: string, world: { __typename?: 'GameWorldView', worldId: string, language: string, description: string, config: { __typename?: 'GameWorldConfig', seed: string, chunkSize: number, detail: number, fogRadius: number, globalScale: number, seaLevel: number, elevationScale: number, roughness: number, moistureScale: number, temperatureOffset: number, roadDensity: number, structureChance: number, structureSpacing: number, structureSizeAvg: number, worldSize: string, worldType: string } }, players: Array<{ __typename?: 'GamePlayerView', userId: string, name: string, characterSheetId?: string | null, characterName?: string | null, ready: boolean, submitted: boolean }>, myself?: { __typename?: 'GameEntityView', characterSheetId: string, blueprintId?: string | null, name: string, type: string, currentHp: number, maxHp: number, ac: number, position?: { __typename?: 'GamePosition', x: number, y: number, z: number } | null, stats?: { __typename?: 'GameAttributes', strength: number, dexterity: number, constitution: number, intelligence: number, wisdom: number, charisma: number } | null } | null, turn?: { __typename?: 'GameTurnView', number: number, status: GameTurnStatus, lastResolvedNumber: number, submittedCount: number, requiredCount: number } | null, mySubmission?: { __typename?: 'GameSubmissionView', submissionId: string, turnNumber: number, kind: GameSubmissionKind, text?: string | null, status: GameSubmissionStatus, feedback?: string | null } | null, visibleEntities: Array<{ __typename?: 'GameEntityView', characterSheetId: string, blueprintId?: string | null, name: string, type: string, currentHp: number, maxHp: number, ac: number, position?: { __typename?: 'GamePosition', x: number, y: number, z: number } | null, stats?: { __typename?: 'GameAttributes', strength: number, dexterity: number, constitution: number, intelligence: number, wisdom: number, charisma: number } | null }>, terrain?: { __typename?: 'GameTerrainView', worldId: string, revision: string, chunkSize: number, minZ: number, maxZ: number, tiles: Array<{ __typename?: 'GameTerrainTile', x: number, y: number, z: number, block: string, biome: string, isWalkable: boolean, isTransparent: boolean }> } | null, messages: { __typename?: 'GameMessagePage', nodes: Array<{ __typename?: 'GameMessageView', messageId: string, turnNumber?: number | null, audience: GameMessageAudience, content: string, senderName: string, senderType: string, timestamp: string }>, pageInfo: { __typename?: 'GameMessagePageInfo', hasPreviousPage: boolean, startCursor?: string | null } }, capabilities: { __typename?: 'GameCapabilities', canStart: boolean, canSubmit: boolean, canResolve: boolean } } };

export type PlayerStartGameMutationVariables = Exact<{
  input: RoomOperationInput;
}>;


export type PlayerStartGameMutation = { __typename?: 'Mutation', startGame: { __typename?: 'RoomOperation', operationId: string, roomId: string, phase: GameRoomPhase, turnNumber?: number | null, status: GameOperationStatus } };

export type PlayerSubmitActionMutationVariables = Exact<{
  input: SubmitActionInput;
}>;


export type PlayerSubmitActionMutation = { __typename?: 'Mutation', submitAction: { __typename?: 'SubmissionReceipt', submissionId: string, turnNumber: number, status: GameSubmissionStatus, submittedCount: number, requiredCount: number } };

export type PlayerResolveTurnMutationVariables = Exact<{
  input: ResolveTurnInput;
}>;


export type PlayerResolveTurnMutation = { __typename?: 'Mutation', resolveTurn: { __typename?: 'RoomOperation', operationId: string, roomId: string, phase: GameRoomPhase, turnNumber?: number | null, status: GameOperationStatus } };

export const PlayerEntityFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlayerEntity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GameEntityView"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"characterSheetId"}},{"kind":"Field","name":{"kind":"Name","value":"blueprintId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"currentHp"}},{"kind":"Field","name":{"kind":"Name","value":"maxHp"}},{"kind":"Field","name":{"kind":"Name","value":"ac"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"z"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"strength"}},{"kind":"Field","name":{"kind":"Name","value":"dexterity"}},{"kind":"Field","name":{"kind":"Name","value":"constitution"}},{"kind":"Field","name":{"kind":"Name","value":"intelligence"}},{"kind":"Field","name":{"kind":"Name","value":"wisdom"}},{"kind":"Field","name":{"kind":"Name","value":"charisma"}}]}}]}}]} as unknown as DocumentNode<PlayerEntityFragment, unknown>;
export const PlayerRoomFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlayerRoom"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RoomView"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUserId"}},{"kind":"Field","name":{"kind":"Name","value":"world"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"worldId"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"config"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seed"}},{"kind":"Field","name":{"kind":"Name","value":"chunkSize"}},{"kind":"Field","name":{"kind":"Name","value":"detail"}},{"kind":"Field","name":{"kind":"Name","value":"fogRadius"}},{"kind":"Field","name":{"kind":"Name","value":"globalScale"}},{"kind":"Field","name":{"kind":"Name","value":"seaLevel"}},{"kind":"Field","name":{"kind":"Name","value":"elevationScale"}},{"kind":"Field","name":{"kind":"Name","value":"roughness"}},{"kind":"Field","name":{"kind":"Name","value":"moistureScale"}},{"kind":"Field","name":{"kind":"Name","value":"temperatureOffset"}},{"kind":"Field","name":{"kind":"Name","value":"roadDensity"}},{"kind":"Field","name":{"kind":"Name","value":"structureChance"}},{"kind":"Field","name":{"kind":"Name","value":"structureSpacing"}},{"kind":"Field","name":{"kind":"Name","value":"structureSizeAvg"}},{"kind":"Field","name":{"kind":"Name","value":"worldSize"}},{"kind":"Field","name":{"kind":"Name","value":"worldType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"characterSheetId"}},{"kind":"Field","name":{"kind":"Name","value":"characterName"}},{"kind":"Field","name":{"kind":"Name","value":"ready"}},{"kind":"Field","name":{"kind":"Name","value":"submitted"}}]}},{"kind":"Field","name":{"kind":"Name","value":"myself"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlayerEntity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"turn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastResolvedNumber"}},{"kind":"Field","name":{"kind":"Name","value":"submittedCount"}},{"kind":"Field","name":{"kind":"Name","value":"requiredCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mySubmission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submissionId"}},{"kind":"Field","name":{"kind":"Name","value":"turnNumber"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"feedback"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibleEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlayerEntity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"terrain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"worldId"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"chunkSize"}},{"kind":"Field","name":{"kind":"Name","value":"minZ"}},{"kind":"Field","name":{"kind":"Name","value":"maxZ"}},{"kind":"Field","name":{"kind":"Name","value":"tiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"z"}},{"kind":"Field","name":{"kind":"Name","value":"block"}},{"kind":"Field","name":{"kind":"Name","value":"biome"}},{"kind":"Field","name":{"kind":"Name","value":"isWalkable"}},{"kind":"Field","name":{"kind":"Name","value":"isTransparent"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageId"}},{"kind":"Field","name":{"kind":"Name","value":"turnNumber"}},{"kind":"Field","name":{"kind":"Name","value":"audience"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"senderName"}},{"kind":"Field","name":{"kind":"Name","value":"senderType"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"capabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canStart"}},{"kind":"Field","name":{"kind":"Name","value":"canSubmit"}},{"kind":"Field","name":{"kind":"Name","value":"canResolve"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlayerEntity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GameEntityView"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"characterSheetId"}},{"kind":"Field","name":{"kind":"Name","value":"blueprintId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"currentHp"}},{"kind":"Field","name":{"kind":"Name","value":"maxHp"}},{"kind":"Field","name":{"kind":"Name","value":"ac"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"z"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"strength"}},{"kind":"Field","name":{"kind":"Name","value":"dexterity"}},{"kind":"Field","name":{"kind":"Name","value":"constitution"}},{"kind":"Field","name":{"kind":"Name","value":"intelligence"}},{"kind":"Field","name":{"kind":"Name","value":"wisdom"}},{"kind":"Field","name":{"kind":"Name","value":"charisma"}}]}}]}}]} as unknown as DocumentNode<PlayerRoomFragment, unknown>;
export const PlayerRoomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PlayerRoom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameView"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlayerRoom"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlayerEntity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GameEntityView"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"characterSheetId"}},{"kind":"Field","name":{"kind":"Name","value":"blueprintId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"currentHp"}},{"kind":"Field","name":{"kind":"Name","value":"maxHp"}},{"kind":"Field","name":{"kind":"Name","value":"ac"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"z"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"strength"}},{"kind":"Field","name":{"kind":"Name","value":"dexterity"}},{"kind":"Field","name":{"kind":"Name","value":"constitution"}},{"kind":"Field","name":{"kind":"Name","value":"intelligence"}},{"kind":"Field","name":{"kind":"Name","value":"wisdom"}},{"kind":"Field","name":{"kind":"Name","value":"charisma"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlayerRoom"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RoomView"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUserId"}},{"kind":"Field","name":{"kind":"Name","value":"world"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"worldId"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"config"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seed"}},{"kind":"Field","name":{"kind":"Name","value":"chunkSize"}},{"kind":"Field","name":{"kind":"Name","value":"detail"}},{"kind":"Field","name":{"kind":"Name","value":"fogRadius"}},{"kind":"Field","name":{"kind":"Name","value":"globalScale"}},{"kind":"Field","name":{"kind":"Name","value":"seaLevel"}},{"kind":"Field","name":{"kind":"Name","value":"elevationScale"}},{"kind":"Field","name":{"kind":"Name","value":"roughness"}},{"kind":"Field","name":{"kind":"Name","value":"moistureScale"}},{"kind":"Field","name":{"kind":"Name","value":"temperatureOffset"}},{"kind":"Field","name":{"kind":"Name","value":"roadDensity"}},{"kind":"Field","name":{"kind":"Name","value":"structureChance"}},{"kind":"Field","name":{"kind":"Name","value":"structureSpacing"}},{"kind":"Field","name":{"kind":"Name","value":"structureSizeAvg"}},{"kind":"Field","name":{"kind":"Name","value":"worldSize"}},{"kind":"Field","name":{"kind":"Name","value":"worldType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"characterSheetId"}},{"kind":"Field","name":{"kind":"Name","value":"characterName"}},{"kind":"Field","name":{"kind":"Name","value":"ready"}},{"kind":"Field","name":{"kind":"Name","value":"submitted"}}]}},{"kind":"Field","name":{"kind":"Name","value":"myself"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlayerEntity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"turn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastResolvedNumber"}},{"kind":"Field","name":{"kind":"Name","value":"submittedCount"}},{"kind":"Field","name":{"kind":"Name","value":"requiredCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mySubmission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submissionId"}},{"kind":"Field","name":{"kind":"Name","value":"turnNumber"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"feedback"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibleEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlayerEntity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"terrain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"worldId"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"chunkSize"}},{"kind":"Field","name":{"kind":"Name","value":"minZ"}},{"kind":"Field","name":{"kind":"Name","value":"maxZ"}},{"kind":"Field","name":{"kind":"Name","value":"tiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"z"}},{"kind":"Field","name":{"kind":"Name","value":"block"}},{"kind":"Field","name":{"kind":"Name","value":"biome"}},{"kind":"Field","name":{"kind":"Name","value":"isWalkable"}},{"kind":"Field","name":{"kind":"Name","value":"isTransparent"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageId"}},{"kind":"Field","name":{"kind":"Name","value":"turnNumber"}},{"kind":"Field","name":{"kind":"Name","value":"audience"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"senderName"}},{"kind":"Field","name":{"kind":"Name","value":"senderType"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"capabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canStart"}},{"kind":"Field","name":{"kind":"Name","value":"canSubmit"}},{"kind":"Field","name":{"kind":"Name","value":"canResolve"}}]}}]}}]} as unknown as DocumentNode<PlayerRoomQuery, PlayerRoomQueryVariables>;
export const PlayerRoomsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PlayerRooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myRooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUserId"}}]}}]}}]} as unknown as DocumentNode<PlayerRoomsQuery, PlayerRoomsQueryVariables>;
export const PlayerBlueprintsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PlayerBlueprints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"characterBlueprints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blueprintId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<PlayerBlueprintsQuery, PlayerBlueprintsQueryVariables>;
export const PlayerMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PlayerMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameMessages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageId"}},{"kind":"Field","name":{"kind":"Name","value":"turnNumber"}},{"kind":"Field","name":{"kind":"Name","value":"audience"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"senderName"}},{"kind":"Field","name":{"kind":"Name","value":"senderType"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<PlayerMessagesQuery, PlayerMessagesQueryVariables>;
export const PlayerCreateRoomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PlayerCreateRoom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateRoomInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRoom"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlayerRoom"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlayerEntity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GameEntityView"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"characterSheetId"}},{"kind":"Field","name":{"kind":"Name","value":"blueprintId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"currentHp"}},{"kind":"Field","name":{"kind":"Name","value":"maxHp"}},{"kind":"Field","name":{"kind":"Name","value":"ac"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"z"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"strength"}},{"kind":"Field","name":{"kind":"Name","value":"dexterity"}},{"kind":"Field","name":{"kind":"Name","value":"constitution"}},{"kind":"Field","name":{"kind":"Name","value":"intelligence"}},{"kind":"Field","name":{"kind":"Name","value":"wisdom"}},{"kind":"Field","name":{"kind":"Name","value":"charisma"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlayerRoom"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RoomView"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUserId"}},{"kind":"Field","name":{"kind":"Name","value":"world"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"worldId"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"config"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seed"}},{"kind":"Field","name":{"kind":"Name","value":"chunkSize"}},{"kind":"Field","name":{"kind":"Name","value":"detail"}},{"kind":"Field","name":{"kind":"Name","value":"fogRadius"}},{"kind":"Field","name":{"kind":"Name","value":"globalScale"}},{"kind":"Field","name":{"kind":"Name","value":"seaLevel"}},{"kind":"Field","name":{"kind":"Name","value":"elevationScale"}},{"kind":"Field","name":{"kind":"Name","value":"roughness"}},{"kind":"Field","name":{"kind":"Name","value":"moistureScale"}},{"kind":"Field","name":{"kind":"Name","value":"temperatureOffset"}},{"kind":"Field","name":{"kind":"Name","value":"roadDensity"}},{"kind":"Field","name":{"kind":"Name","value":"structureChance"}},{"kind":"Field","name":{"kind":"Name","value":"structureSpacing"}},{"kind":"Field","name":{"kind":"Name","value":"structureSizeAvg"}},{"kind":"Field","name":{"kind":"Name","value":"worldSize"}},{"kind":"Field","name":{"kind":"Name","value":"worldType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"characterSheetId"}},{"kind":"Field","name":{"kind":"Name","value":"characterName"}},{"kind":"Field","name":{"kind":"Name","value":"ready"}},{"kind":"Field","name":{"kind":"Name","value":"submitted"}}]}},{"kind":"Field","name":{"kind":"Name","value":"myself"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlayerEntity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"turn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastResolvedNumber"}},{"kind":"Field","name":{"kind":"Name","value":"submittedCount"}},{"kind":"Field","name":{"kind":"Name","value":"requiredCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mySubmission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submissionId"}},{"kind":"Field","name":{"kind":"Name","value":"turnNumber"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"feedback"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibleEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlayerEntity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"terrain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"worldId"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"chunkSize"}},{"kind":"Field","name":{"kind":"Name","value":"minZ"}},{"kind":"Field","name":{"kind":"Name","value":"maxZ"}},{"kind":"Field","name":{"kind":"Name","value":"tiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"z"}},{"kind":"Field","name":{"kind":"Name","value":"block"}},{"kind":"Field","name":{"kind":"Name","value":"biome"}},{"kind":"Field","name":{"kind":"Name","value":"isWalkable"}},{"kind":"Field","name":{"kind":"Name","value":"isTransparent"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageId"}},{"kind":"Field","name":{"kind":"Name","value":"turnNumber"}},{"kind":"Field","name":{"kind":"Name","value":"audience"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"senderName"}},{"kind":"Field","name":{"kind":"Name","value":"senderType"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"capabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canStart"}},{"kind":"Field","name":{"kind":"Name","value":"canSubmit"}},{"kind":"Field","name":{"kind":"Name","value":"canResolve"}}]}}]}}]} as unknown as DocumentNode<PlayerCreateRoomMutation, PlayerCreateRoomMutationVariables>;
export const PlayerJoinRoomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PlayerJoinRoom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JoinRoomInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"joinRoom"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlayerRoom"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlayerEntity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GameEntityView"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"characterSheetId"}},{"kind":"Field","name":{"kind":"Name","value":"blueprintId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"currentHp"}},{"kind":"Field","name":{"kind":"Name","value":"maxHp"}},{"kind":"Field","name":{"kind":"Name","value":"ac"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"z"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"strength"}},{"kind":"Field","name":{"kind":"Name","value":"dexterity"}},{"kind":"Field","name":{"kind":"Name","value":"constitution"}},{"kind":"Field","name":{"kind":"Name","value":"intelligence"}},{"kind":"Field","name":{"kind":"Name","value":"wisdom"}},{"kind":"Field","name":{"kind":"Name","value":"charisma"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlayerRoom"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RoomView"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUserId"}},{"kind":"Field","name":{"kind":"Name","value":"world"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"worldId"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"config"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seed"}},{"kind":"Field","name":{"kind":"Name","value":"chunkSize"}},{"kind":"Field","name":{"kind":"Name","value":"detail"}},{"kind":"Field","name":{"kind":"Name","value":"fogRadius"}},{"kind":"Field","name":{"kind":"Name","value":"globalScale"}},{"kind":"Field","name":{"kind":"Name","value":"seaLevel"}},{"kind":"Field","name":{"kind":"Name","value":"elevationScale"}},{"kind":"Field","name":{"kind":"Name","value":"roughness"}},{"kind":"Field","name":{"kind":"Name","value":"moistureScale"}},{"kind":"Field","name":{"kind":"Name","value":"temperatureOffset"}},{"kind":"Field","name":{"kind":"Name","value":"roadDensity"}},{"kind":"Field","name":{"kind":"Name","value":"structureChance"}},{"kind":"Field","name":{"kind":"Name","value":"structureSpacing"}},{"kind":"Field","name":{"kind":"Name","value":"structureSizeAvg"}},{"kind":"Field","name":{"kind":"Name","value":"worldSize"}},{"kind":"Field","name":{"kind":"Name","value":"worldType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"characterSheetId"}},{"kind":"Field","name":{"kind":"Name","value":"characterName"}},{"kind":"Field","name":{"kind":"Name","value":"ready"}},{"kind":"Field","name":{"kind":"Name","value":"submitted"}}]}},{"kind":"Field","name":{"kind":"Name","value":"myself"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlayerEntity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"turn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastResolvedNumber"}},{"kind":"Field","name":{"kind":"Name","value":"submittedCount"}},{"kind":"Field","name":{"kind":"Name","value":"requiredCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mySubmission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submissionId"}},{"kind":"Field","name":{"kind":"Name","value":"turnNumber"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"feedback"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibleEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlayerEntity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"terrain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"worldId"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"chunkSize"}},{"kind":"Field","name":{"kind":"Name","value":"minZ"}},{"kind":"Field","name":{"kind":"Name","value":"maxZ"}},{"kind":"Field","name":{"kind":"Name","value":"tiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"z"}},{"kind":"Field","name":{"kind":"Name","value":"block"}},{"kind":"Field","name":{"kind":"Name","value":"biome"}},{"kind":"Field","name":{"kind":"Name","value":"isWalkable"}},{"kind":"Field","name":{"kind":"Name","value":"isTransparent"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageId"}},{"kind":"Field","name":{"kind":"Name","value":"turnNumber"}},{"kind":"Field","name":{"kind":"Name","value":"audience"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"senderName"}},{"kind":"Field","name":{"kind":"Name","value":"senderType"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"capabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canStart"}},{"kind":"Field","name":{"kind":"Name","value":"canSubmit"}},{"kind":"Field","name":{"kind":"Name","value":"canResolve"}}]}}]}}]} as unknown as DocumentNode<PlayerJoinRoomMutation, PlayerJoinRoomMutationVariables>;
export const PlayerSelectCharacterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PlayerSelectCharacter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SelectCharacterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectCharacter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlayerRoom"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlayerEntity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GameEntityView"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"characterSheetId"}},{"kind":"Field","name":{"kind":"Name","value":"blueprintId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"currentHp"}},{"kind":"Field","name":{"kind":"Name","value":"maxHp"}},{"kind":"Field","name":{"kind":"Name","value":"ac"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"z"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"strength"}},{"kind":"Field","name":{"kind":"Name","value":"dexterity"}},{"kind":"Field","name":{"kind":"Name","value":"constitution"}},{"kind":"Field","name":{"kind":"Name","value":"intelligence"}},{"kind":"Field","name":{"kind":"Name","value":"wisdom"}},{"kind":"Field","name":{"kind":"Name","value":"charisma"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlayerRoom"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RoomView"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUserId"}},{"kind":"Field","name":{"kind":"Name","value":"world"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"worldId"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"config"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seed"}},{"kind":"Field","name":{"kind":"Name","value":"chunkSize"}},{"kind":"Field","name":{"kind":"Name","value":"detail"}},{"kind":"Field","name":{"kind":"Name","value":"fogRadius"}},{"kind":"Field","name":{"kind":"Name","value":"globalScale"}},{"kind":"Field","name":{"kind":"Name","value":"seaLevel"}},{"kind":"Field","name":{"kind":"Name","value":"elevationScale"}},{"kind":"Field","name":{"kind":"Name","value":"roughness"}},{"kind":"Field","name":{"kind":"Name","value":"moistureScale"}},{"kind":"Field","name":{"kind":"Name","value":"temperatureOffset"}},{"kind":"Field","name":{"kind":"Name","value":"roadDensity"}},{"kind":"Field","name":{"kind":"Name","value":"structureChance"}},{"kind":"Field","name":{"kind":"Name","value":"structureSpacing"}},{"kind":"Field","name":{"kind":"Name","value":"structureSizeAvg"}},{"kind":"Field","name":{"kind":"Name","value":"worldSize"}},{"kind":"Field","name":{"kind":"Name","value":"worldType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"characterSheetId"}},{"kind":"Field","name":{"kind":"Name","value":"characterName"}},{"kind":"Field","name":{"kind":"Name","value":"ready"}},{"kind":"Field","name":{"kind":"Name","value":"submitted"}}]}},{"kind":"Field","name":{"kind":"Name","value":"myself"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlayerEntity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"turn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastResolvedNumber"}},{"kind":"Field","name":{"kind":"Name","value":"submittedCount"}},{"kind":"Field","name":{"kind":"Name","value":"requiredCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mySubmission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submissionId"}},{"kind":"Field","name":{"kind":"Name","value":"turnNumber"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"feedback"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibleEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlayerEntity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"terrain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"worldId"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"chunkSize"}},{"kind":"Field","name":{"kind":"Name","value":"minZ"}},{"kind":"Field","name":{"kind":"Name","value":"maxZ"}},{"kind":"Field","name":{"kind":"Name","value":"tiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"z"}},{"kind":"Field","name":{"kind":"Name","value":"block"}},{"kind":"Field","name":{"kind":"Name","value":"biome"}},{"kind":"Field","name":{"kind":"Name","value":"isWalkable"}},{"kind":"Field","name":{"kind":"Name","value":"isTransparent"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageId"}},{"kind":"Field","name":{"kind":"Name","value":"turnNumber"}},{"kind":"Field","name":{"kind":"Name","value":"audience"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"senderName"}},{"kind":"Field","name":{"kind":"Name","value":"senderType"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"capabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canStart"}},{"kind":"Field","name":{"kind":"Name","value":"canSubmit"}},{"kind":"Field","name":{"kind":"Name","value":"canResolve"}}]}}]}}]} as unknown as DocumentNode<PlayerSelectCharacterMutation, PlayerSelectCharacterMutationVariables>;
export const PlayerSetReadyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PlayerSetReady"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetReadyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setReady"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlayerRoom"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlayerEntity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GameEntityView"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"characterSheetId"}},{"kind":"Field","name":{"kind":"Name","value":"blueprintId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"currentHp"}},{"kind":"Field","name":{"kind":"Name","value":"maxHp"}},{"kind":"Field","name":{"kind":"Name","value":"ac"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"z"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"strength"}},{"kind":"Field","name":{"kind":"Name","value":"dexterity"}},{"kind":"Field","name":{"kind":"Name","value":"constitution"}},{"kind":"Field","name":{"kind":"Name","value":"intelligence"}},{"kind":"Field","name":{"kind":"Name","value":"wisdom"}},{"kind":"Field","name":{"kind":"Name","value":"charisma"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlayerRoom"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RoomView"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUserId"}},{"kind":"Field","name":{"kind":"Name","value":"world"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"worldId"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"config"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seed"}},{"kind":"Field","name":{"kind":"Name","value":"chunkSize"}},{"kind":"Field","name":{"kind":"Name","value":"detail"}},{"kind":"Field","name":{"kind":"Name","value":"fogRadius"}},{"kind":"Field","name":{"kind":"Name","value":"globalScale"}},{"kind":"Field","name":{"kind":"Name","value":"seaLevel"}},{"kind":"Field","name":{"kind":"Name","value":"elevationScale"}},{"kind":"Field","name":{"kind":"Name","value":"roughness"}},{"kind":"Field","name":{"kind":"Name","value":"moistureScale"}},{"kind":"Field","name":{"kind":"Name","value":"temperatureOffset"}},{"kind":"Field","name":{"kind":"Name","value":"roadDensity"}},{"kind":"Field","name":{"kind":"Name","value":"structureChance"}},{"kind":"Field","name":{"kind":"Name","value":"structureSpacing"}},{"kind":"Field","name":{"kind":"Name","value":"structureSizeAvg"}},{"kind":"Field","name":{"kind":"Name","value":"worldSize"}},{"kind":"Field","name":{"kind":"Name","value":"worldType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"characterSheetId"}},{"kind":"Field","name":{"kind":"Name","value":"characterName"}},{"kind":"Field","name":{"kind":"Name","value":"ready"}},{"kind":"Field","name":{"kind":"Name","value":"submitted"}}]}},{"kind":"Field","name":{"kind":"Name","value":"myself"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlayerEntity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"turn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastResolvedNumber"}},{"kind":"Field","name":{"kind":"Name","value":"submittedCount"}},{"kind":"Field","name":{"kind":"Name","value":"requiredCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mySubmission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submissionId"}},{"kind":"Field","name":{"kind":"Name","value":"turnNumber"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"feedback"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibleEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlayerEntity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"terrain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"worldId"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"chunkSize"}},{"kind":"Field","name":{"kind":"Name","value":"minZ"}},{"kind":"Field","name":{"kind":"Name","value":"maxZ"}},{"kind":"Field","name":{"kind":"Name","value":"tiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"z"}},{"kind":"Field","name":{"kind":"Name","value":"block"}},{"kind":"Field","name":{"kind":"Name","value":"biome"}},{"kind":"Field","name":{"kind":"Name","value":"isWalkable"}},{"kind":"Field","name":{"kind":"Name","value":"isTransparent"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageId"}},{"kind":"Field","name":{"kind":"Name","value":"turnNumber"}},{"kind":"Field","name":{"kind":"Name","value":"audience"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"senderName"}},{"kind":"Field","name":{"kind":"Name","value":"senderType"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"capabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canStart"}},{"kind":"Field","name":{"kind":"Name","value":"canSubmit"}},{"kind":"Field","name":{"kind":"Name","value":"canResolve"}}]}}]}}]} as unknown as DocumentNode<PlayerSetReadyMutation, PlayerSetReadyMutationVariables>;
export const PlayerStartGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PlayerStartGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RoomOperationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operationId"}},{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"turnNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<PlayerStartGameMutation, PlayerStartGameMutationVariables>;
export const PlayerSubmitActionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PlayerSubmitAction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubmitActionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitAction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submissionId"}},{"kind":"Field","name":{"kind":"Name","value":"turnNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"submittedCount"}},{"kind":"Field","name":{"kind":"Name","value":"requiredCount"}}]}}]}}]} as unknown as DocumentNode<PlayerSubmitActionMutation, PlayerSubmitActionMutationVariables>;
export const PlayerResolveTurnDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PlayerResolveTurn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResolveTurnInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resolveTurn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operationId"}},{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"turnNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<PlayerResolveTurnMutation, PlayerResolveTurnMutationVariables>;