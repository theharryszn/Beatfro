import { AlbumResolver } from "./AlbumResolver";
import { ArtisteResolver } from "./ArtisteResolver";
import { BlogResolver } from "./BlogResolver";
import { LyricResolver } from "./LyricResolver";
import { TrackResolver } from "./TrackResolver";
import { UserResolver } from "./UserResolver";

const RootResolver : readonly[Function, ...Function[]] | [Function, ...Function[]] | readonly[string, ...string[]] | [string, ...string[]] =[
    BlogResolver,
    UserResolver,
    ArtisteResolver,
    TrackResolver,
    AlbumResolver,
    LyricResolver
]


export default RootResolver;