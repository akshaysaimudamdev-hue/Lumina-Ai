export function parseAIResponse(response: any) {

    if (typeof response !== "string") {
        return {
            project: "",
            explanation: "",
            run: "",
            files: [],
        };
    }

    if (!response.includes("<ProjectStructure>")) {
        return {
            project: "",
            explanation: response,
            run: "",
            files: [],
        };
    }

    const project =
        response.match(
            /<ProjectStructure>([\s\S]*?)<\/ProjectStructure>/
        )?.[1] || "";

    const explanation =
        response.match(
            /<Explanation>([\s\S]*?)<\/Explanation>/
        )?.[1] || "";

    const run =
        response.match(
            /<Run>([\s\S]*?)<\/Run>/
        )?.[1] || "";

    const fileRegex =
        /<File name="(.*?)" language="(.*?)">([\s\S]*?)<\/File>/g;

    const files = [];

    let match;

    while ((match = fileRegex.exec(response)) !== null) {

        files.push({
            name: match[1],
            language: match[2],
            code: match[3].trim(),
        });

    }

    return {
        project,
        explanation,
        run,
        files,
    };
}