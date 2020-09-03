export class UpdateExerciseModel {
    constructor(
        public session_id: string,
        public title: string,
        public content: string,
        public answer: string,
        public duration: string,
        public show_answer: string,
    ) {
    }
}
