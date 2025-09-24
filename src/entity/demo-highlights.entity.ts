import { Column, Entity, PrimaryColumn } from "typeorm";
import { MatchHighlightsEvent } from "../gateway/events/match-highlights.event";

@Entity("demo_highlights")
export class DemoHighlightsEntity {
  @PrimaryColumn({
    name: "match_id",
  })
  matchId: number;

  @Column({
    type: "jsonb",
  })
  highlights: MatchHighlightsEvent;
}

