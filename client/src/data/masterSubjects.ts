export interface SubjectCondition {
  conditionName: string;
  difficulty: number;
  clinicalImportance: number;
  examRelevance: number;
}

export interface SubjectsData {
  [key: string]: SubjectCondition[];
}

const masterSubjects: SubjectsData = {
  "Cardiology": [
    {
      conditionName: "Acute Coronary Syndrome",
      difficulty: 8,
      clinicalImportance: 9,
      examRelevance: 9
    },
    {
      conditionName: "Heart Failure",
      difficulty: 7,
      clinicalImportance: 9,
      examRelevance: 8
    }
  ],
  "Respiratory": [
    {
      conditionName: "Asthma",
      difficulty: 6,
      clinicalImportance: 9,
      examRelevance: 8
    },
    {
      conditionName: "COPD",
      difficulty: 7,
      clinicalImportance: 8,
      examRelevance: 8
    }
  ],
  "Neurology": [
    {
      conditionName: "Stroke",
      difficulty: 8,
      clinicalImportance: 9,
      examRelevance: 9
    },
    {
      conditionName: "Epilepsy",
      difficulty: 7,
      clinicalImportance: 8,
      examRelevance: 7
    }
  ],
  "Endocrinology": [
    {
      conditionName: "Diabetes Mellitus",
      difficulty: 8,
      clinicalImportance: 9,
      examRelevance: 9
    },
    {
      conditionName: "Thyroid Disorders",
      difficulty: 7,
      clinicalImportance: 8,
      examRelevance: 8
    }
  ],
  "Gastroenterology": [
    {
      conditionName: "IBD",
      difficulty: 7,
      clinicalImportance: 8,
      examRelevance: 7
    },
    {
      conditionName: "Liver Disease",
      difficulty: 8,
      clinicalImportance: 8,
      examRelevance: 8
    }
  ]
};

export default masterSubjects;
