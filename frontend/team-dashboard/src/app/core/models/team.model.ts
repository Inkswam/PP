export interface Team {
  id: number;
  name: string;
  participants: string[];
  ownerId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTeamRequest {
  name: string;
  participants: string[];
}

export interface TeamDto {
  id: number;
  name: string;
  participants: string[];
  ownerId: number;
}
