export class ChallengeResponseDto {
  challengeId: number;
  startDate: Date;
  endDate: Date;
  wakeTime: Date;
  hostId: number;
  duration: number;
  mates: ParticipantDto[];
}
export class ParticipantDto {
  userId: number;
  userName: string;
}
