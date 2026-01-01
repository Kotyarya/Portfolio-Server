export type ProjectDataType = {
    id: number;
    name: string;
    githubLink: string;
    link: string | null;
    text: string;
    importance: number;
    img: string[];
    preview: string;
    skills: {
        name: string;
        importance: number;
    }[];
    category: {
        name: string;
    };
    status: {
        name: string;
        img: string;
    };
};


export type SkillDTO = { name: string; importance: number };