import { MatchArtifactUploadedEvent } from "../../gateway/events/match-artifact-uploaded.event";

export class MatchArtifactUploadedCommand {
  constructor(public readonly event: MatchArtifactUploadedEvent) {}
}
