export interface VideoInterface {
    Title: string;
    UploadDate: string;
    NumericDate: number;
    VideoType?: string | null,
    Duration: string;
    DurationInS: number | string;
    ViewCount: number | string;
    LikeCount: number | string;
    CommentCount: number | string;
}

export interface VidCountInterface {
    LongForms?: number;
    Shorts?: number;
    Livestreams?: number;
}