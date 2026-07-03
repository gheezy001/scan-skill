export declare class AiAnalysisController {
    analyze(body: {
        type: string;
        entity: any;
    }): Promise<{
        analyse: any;
    }>;
}
