import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  NotImplementedException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/createChallenge.dto';
import { AuthenticateGuard } from 'src/auth/auth.guard';
import { AcceptInvitationDto } from './dto/acceptInvitaion.dto';
import { ChallengeResponseDto } from './dto/challengeResponse.dto';
import { ChallengeResultDto } from './dto/challengeResult.dto';

@Controller('api/challenge')
export class ChallengesController {
  constructor(private readonly challengeService: ChallengesService) {}
  @Get()
  async getChallengeInfo(
    @Query('challengeId') challengeId: number,
  ): Promise<ChallengeResponseDto> {
    const challenge = await this.challengeService.getChallengeInfo(challengeId);
    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${challengeId} not found`);
    }
    return challenge;
  }
  @Post('create')
  async createChallenge(@Body() createChallengeDto: CreateChallengeDto) {
    console.log('create');
    console.log(createChallengeDto);
    const challenge =
      await this.challengeService.createChallenge(createChallengeDto);

    const challenge_id = await this.challengeService.hostChallengeStatus(
      createChallengeDto.hostId,
    );

    for (let i = 0; i < createChallengeDto.mates.length; i++) {
      const send = await this.challengeService.sendInvitation(
        challenge_id,
        createChallengeDto.mates[i],
      );
    }
    return 'create';
  }
  @Get('searchmate')
  async searchMate(@Query('email') email: string) {
    const result = await this.challengeService.searchAvailableMate(email);
    return {
      isEngaged: result,
    };
  }
  @Get('invitations')
  getInvitations(@Query('guestId') guestId: number) {
    console.log(guestId);
    const invitations = this.challengeService.getInvitations(guestId);
    return invitations; // 데이터 반환 값 수정 예정
  }
  @Post('acceptInvitation')
  async acceptInvitation(@Body() acceptInvitationDto: AcceptInvitationDto) {
    const result =
      await this.challengeService.acceptInvitation(acceptInvitationDto);
    if (result.success === true) {
      return 'accept';
    } else {
      throw new BadRequestException('승낙 실패');
    }
  }

  @Get('calendar/:userId/:month')
  async getChallengeCalendar(
    @Param('userId') userId: number,
    @Param('month') month: number,
  ): Promise<string[]> {
    return this.challengeService.getChallengeCalendar(userId, month);
  }

  @Get('/:userId/results/:date')
  async getChallengeResults(
    @Param('userId') userId: number,
    @Param('date') date: Date,
  ): Promise<ChallengeResultDto[]> {
    const result = await this.challengeService.getResultsByDateAndUser(
      userId,
      date,
    );
    return result;
  }
}