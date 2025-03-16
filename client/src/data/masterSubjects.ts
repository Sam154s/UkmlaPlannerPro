
export interface TopicRating {
  difficulty: number;
  clinicalImportance: number;
  examRelevance: number;
}

export interface Topic {
  name: string;
  ratings: TopicRating;
}

export interface Subject {
  name: string;
  topics: Topic[];
}

export type SubjectsData = Subject[];

const masterSubjects: SubjectsData = [
  {
    "name": "Acute and emergency",
    "topics": [
      {
        "name": "Acid-base abnormality",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 7
        }
      },
      {
        "name": "Acute bronchitis",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Acute coronary syndromes",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 9,
          "examRelevance": 8
        }
      },
      {
        "name": "Acute kidney injury",
        "ratings": {
          "difficulty": 10,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Allergic disorder",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 9,
          "examRelevance": 7
        }
      },
      {
        "name": "Anaphylaxis",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Aortic aneurysm",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Arrhythmias",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Cardiac arrest",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Cardiac failure",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 9,
          "examRelevance": 8
        }
      },
      {
        "name": "Chronic obstructive pulmonary disease",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Compartment syndrome",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 5,
          "examRelevance": 4
        }
      },
      {
        "name": "Deep vein thrombosis",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Dehydration",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 6
        }
      },
      {
        "name": "Diabetic ketoacidosis",
        "ratings": {
          "difficulty": 9,
          "clinicalImportance": 9,
          "examRelevance": 10
        }
      },
      {
        "name": "Drug overdose",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Ectopic pregnancy",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      },
      {
        "name": "Epilepsy",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      },
      {
        "name": "Epistaxis",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 9,
          "examRelevance": 6
        }
      },
      {
        "name": "Extradural haemorrhage",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 7
        }
      },
      {
        "name": "Gastrointestinal perforation",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Haemoglobinopathies",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 7,
          "examRelevance": 5
        }
      },
      {
        "name": "Hyperosmolar hyperglycaemic state",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 6,
          "examRelevance": 6
        }
      },
      {
        "name": "Hyperthermia and hypothermia",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 6,
          "examRelevance": 3
        }
      },
      {
        "name": "Meningitis",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Myocardial infarction",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Necrotising fasciitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 4
        }
      },
      {
        "name": "Non-accidental injury",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Pancytopenia",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Pneumonia",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Pneumothorax",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Postpartum haemorrhage",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 9,
          "examRelevance": 6
        }
      },
      {
        "name": "Pulmonary embolism",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Raised intracranial pressure",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 6,
          "examRelevance": 6
        }
      },
      {
        "name": "Respiratory arrest",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 6
        }
      },
      {
        "name": "Respiratory failure",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Self-harm",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 5,
          "examRelevance": 3
        }
      },
      {
        "name": "Sepsis",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Spinal cord compression",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 7,
          "examRelevance": 6
        }
      },
      {
        "name": "Spinal cord injury",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 4
        }
      },
      {
        "name": "Spinal fracture",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Stroke",
        "ratings": {
          "difficulty": 9,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Subarachnoid haemorrhage",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Subdural haemorrhage",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Substance use disorder",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Testicular torsion",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 7,
          "examRelevance": 4
        }
      },
      {
        "name": "Toxic shock syndrome",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Transfusion reactions",
        "ratings": {
          "difficulty": 9,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Unstable angina",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 9
        }
      }
    ]
  },
  {
    "name": "Cancer",
    "topics": [
      {
        "name": "Basal cell carcinoma",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Bladder cancer",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Brain metastases",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 4
        }
      },
      {
        "name": "Breast cancer",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Cervical cancer",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Colorectal tumours",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 8,
          "examRelevance": 7
        }
      },
      {
        "name": "Endometrial cancer",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Gastric cancer",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 8,
          "examRelevance": 7
        }
      },
      {
        "name": "Hypercalcaemia of malignancy",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Leukaemia",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 5
        }
      },
      {
        "name": "Lung cancer",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Lymphoma",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Malignant melanoma",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Metastatic disease",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Multiple myeloma",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Oesophageal cancer",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Ovarian cancer",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 6,
          "examRelevance": 6
        }
      },
      {
        "name": "Pancreatic cancer",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      },
      {
        "name": "Pathological fracture",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 6,
          "examRelevance": 4
        }
      },
      {
        "name": "Patient on anti-coagulant therapy",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 9
        }
      },
      {
        "name": "Prostate cancer",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Spinal cord compression",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Squamous cell carcinoma",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Testicular cancer",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      }
    ]
  },
  {
    "name": "Cardiovascular",
    "topics": [
      {
        "name": "Acute coronary syndromes",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 9
        }
      },
      {
        "name": "Aneurysms, ischaemic limb and occlusions",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 5,
          "examRelevance": 3
        }
      },
      {
        "name": "Aortic aneurysm",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Aortic dissection",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Aortic valve disease",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Arrhythmias",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Arterial thrombosis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Arterial ulcers",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 8
        }
      },
      {
        "name": "Cardiac arrest",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Cardiac failure",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 9,
          "examRelevance": 8
        }
      },
      {
        "name": "Deep vein thrombosis",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Essential or secondary hypertension",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 6
        }
      },
      {
        "name": "Gangrene",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Haemochromatosis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 3,
          "examRelevance": 4
        }
      },
      {
        "name": "Infective endocarditis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 8,
          "examRelevance": 9
        }
      },
      {
        "name": "Intestinal ischaemia",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Ischaemic heart disease",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Mitral valve disease",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Myocarditis",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 4
        }
      },
      {
        "name": "Pericardial disease",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      },
      {
        "name": "Peripheral vascular disease",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Pulmonary embolism",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Pulmonary hypertension",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 6,
          "examRelevance": 6
        }
      },
      {
        "name": "Right heart valve disease",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Stroke",
        "ratings": {
          "difficulty": 9,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Transient ischaemic attacks",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Vasovagal syncope",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Venous ulcers",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 7
        }
      }
    ]
  },
  {
    "name": "Child health",
    "topics": [
      {
        "name": "Acute kidney injury",
        "ratings": {
          "difficulty": 10,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Anaemia",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Anaphylaxis",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Appendicitis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Asthma",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 9,
          "examRelevance": 10
        }
      },
      {
        "name": "Atopic dermatitis and eczema",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 7,
          "examRelevance": 9
        }
      },
      {
        "name": "Attention deficit hyperactivity disorder",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 2,
          "examRelevance": 3
        }
      },
      {
        "name": "Autism spectrum disorder",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Biliary atresia",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 4,
          "examRelevance": 6
        }
      },
      {
        "name": "Bronchiectasis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      },
      {
        "name": "Bronchiolitis",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 2
        }
      },
      {
        "name": "Candidiasis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Cardiac arrest",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Cellulitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Cerebral palsy and hypoxic-ischaemic encephalopathy",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 4,
          "examRelevance": 2
        }
      },
      {
        "name": "Chronic kidney disease",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 8,
          "examRelevance": 6
        }
      },
      {
        "name": "Coeliac disease",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Conjunctivitis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Constipation",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 8,
          "examRelevance": 6
        }
      },
      {
        "name": "Croup",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Cushing\u2019s syndrome",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Cystic fibrosis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 7,
          "examRelevance": 6
        }
      },
      {
        "name": "Dehydration",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 6
        }
      },
      {
        "name": "Developmental delay",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 2
        }
      },
      {
        "name": "Diabetic ketoacidosis",
        "ratings": {
          "difficulty": 9,
          "clinicalImportance": 9,
          "examRelevance": 10
        }
      },
      {
        "name": "Diabetes mellitus type 1 and 2",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 9
        }
      },
      {
        "name": "Disseminated intravascular coagulation",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Down's syndrome",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 6
        }
      },
      {
        "name": "Drug overdose",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Eating disorders",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Epididymitis and orchitis",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 2
        }
      },
      {
        "name": "Epiglottitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 7
        }
      },
      {
        "name": "Epilepsy",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      },
      {
        "name": "Febrile convulsion",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 5,
          "examRelevance": 2
        }
      },
      {
        "name": "Gastro-oesophageal reflux disease",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 7,
          "examRelevance": 9
        }
      },
      {
        "name": "Henoch-Schonlein purpura",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Hepatitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Hernias",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 2,
          "examRelevance": 3
        }
      },
      {
        "name": "Herpes simplex virus",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 4,
          "examRelevance": 5
        }
      },
      {
        "name": "Human papilloma virus infection",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 6,
          "examRelevance": 6
        }
      },
      {
        "name": "Hypoglycaemia",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 5,
          "examRelevance": 4
        }
      },
      {
        "name": "Hyposplenism/splenectomy",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Hypothyroidism",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Idiopathic arthritis",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Impetigo",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 3,
          "examRelevance": 5
        }
      },
      {
        "name": "Inflammatory bowel disease",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 6,
          "examRelevance": 9
        }
      },
      {
        "name": "Influenza",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Intestinal obstruction and ileus",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 4
        }
      },
      {
        "name": "Intussusception",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      },
      {
        "name": "Kawasaki disease",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      },
      {
        "name": "Leukaemia",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 5
        }
      },
      {
        "name": "Lower respiratory tract infection",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 9
        }
      },
      {
        "name": "Lymphoma",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Malaria",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 2,
          "examRelevance": 3
        }
      },
      {
        "name": "Malnutrition",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 3
        }
      },
      {
        "name": "Measles",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Meningitis",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Migraine",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 3,
          "examRelevance": 5
        }
      },
      {
        "name": "Mumps",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 3,
          "examRelevance": 2
        }
      },
      {
        "name": "Muscular dystrophies",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 2,
          "examRelevance": 1
        }
      },
      {
        "name": "Non-accidental injury",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Obesity",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 7,
          "examRelevance": 6
        }
      },
      {
        "name": "Obstructive sleep apnoea",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 2
        }
      },
      {
        "name": "Otitis media",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Pancytopenia",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Peptic ulcer disease and gastritis",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 6
        }
      },
      {
        "name": "Periorbital and orbital cellulitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Peripheral nerve injuries/palsies",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 4,
          "examRelevance": 5
        }
      },
      {
        "name": "Peritonitis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 5,
          "examRelevance": 4
        }
      },
      {
        "name": "Pyloric stenosis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 6,
          "examRelevance": 6
        }
      },
      {
        "name": "Pneumothorax",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Raised intracranial pressure",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 6,
          "examRelevance": 6
        }
      },
      {
        "name": "Reactive arthritis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 3,
          "examRelevance": 4
        }
      },
      {
        "name": "Respiratory arrest",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 6
        }
      },
      {
        "name": "Rubella",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 3,
          "examRelevance": 2
        }
      },
      {
        "name": "Self-harm",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 5,
          "examRelevance": 3
        }
      },
      {
        "name": "Septic arthritis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Sickle cell disease",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 4,
          "examRelevance": 5
        }
      },
      {
        "name": "Subarachnoid haemorrhage",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Subdural haemorrhage",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Substance use disorder",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Tension headache",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 4,
          "examRelevance": 6
        }
      },
      {
        "name": "Testicular torsion",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 7,
          "examRelevance": 4
        }
      },
      {
        "name": "Thyrotoxicosis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Tonsillitis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      },
      {
        "name": "Toxic shock syndrome",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Tuberculosis",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      },
      {
        "name": "Upper respiratory tract infection",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Urinary tract infection",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 9,
          "examRelevance": 10
        }
      },
      {
        "name": "Urticaria",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 5
        }
      },
      {
        "name": "Viral exanthema",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 7,
          "examRelevance": 9
        }
      },
      {
        "name": "Viral gastroenteritis",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 3,
          "examRelevance": 2
        }
      },
      {
        "name": "Visual field defects",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Volvulus",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 8,
          "examRelevance": 6
        }
      }
    ]
  },
  {
    "name": "Neuroscience",
    "topics": [
      {
        "name": "Acoustic neuroma",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Bell's palsy",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Brain abscess",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 3
        }
      },
      {
        "name": "Brain metastases",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 8
        }
      },
      {
        "name": "Cerebral palsy and hypoxic-ischaemic encephalopathy",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 4,
          "examRelevance": 2
        }
      },
      {
        "name": "Chronic fatigue syndrome",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Dementias",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Diabetic neuropathy",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Encephalitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 7
        }
      },
      {
        "name": "Epilepsy",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      },
      {
        "name": "Essential tremor",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 6,
          "examRelevance": 2
        }
      },
      {
        "name": "Extradural haemorrhage",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 7
        }
      },
      {
        "name": "Febrile convulsion",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 5,
          "examRelevance": 2
        }
      },
      {
        "name": "Malaria",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 2,
          "examRelevance": 3
        }
      },
      {
        "name": "Me\u0301nie\u0300re's disease",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 6
        }
      },
      {
        "name": "Meningitis",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Metastatic disease",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Migraine",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 3,
          "examRelevance": 5
        }
      },
      {
        "name": "Motor neurone disease",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 5
        }
      },
      {
        "name": "Multiple sclerosis",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 7,
          "examRelevance": 9
        }
      },
      {
        "name": "Muscular dystrophies",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 2,
          "examRelevance": 1
        }
      },
      {
        "name": "Myasthenia gravis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 4,
          "examRelevance": 6
        }
      },
      {
        "name": "Parkinson's disease",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 6,
          "examRelevance": 8
        }
      },
      {
        "name": "Peripheral nerve injuries/palsies",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 4,
          "examRelevance": 5
        }
      },
      {
        "name": "Radiculopathies",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Raised intracranial pressure",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 6,
          "examRelevance": 6
        }
      },
      {
        "name": "Spinal cord compression",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Spinal cord injury",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 4
        }
      },
      {
        "name": "Spinal fracture",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Stroke",
        "ratings": {
          "difficulty": 9,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Subarachnoid haemorrhage",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Subdural haemorrhage",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Tension headache",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 4,
          "examRelevance": 6
        }
      },
      {
        "name": "Transient ischaemic attacks",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Trigeminal neuralgia",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      },
      {
        "name": "Wernicke's encephalopathy",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 9,
          "examRelevance": 8
        }
      }
    ]
  },
  {
    "name": "Clinical Haematology",
    "topics": [
      {
        "name": "Anaemia",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Deep vein thrombosis",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Disseminated intravascular coagulation",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Epistaxis",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 9,
          "examRelevance": 6
        }
      },
      {
        "name": "Haemochromatosis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 3,
          "examRelevance": 4
        }
      },
      {
        "name": "Haemoglobinopathies",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 7,
          "examRelevance": 5
        }
      },
      {
        "name": "Haemophilia",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Hyposplenism/splenectomy",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Leukaemia",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 5
        }
      },
      {
        "name": "Lymphoma",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Multiple myeloma",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Myeloproliferative disorders",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 6,
          "examRelevance": 8
        }
      },
      {
        "name": "Pancytopenia",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Pathological fracture",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 6,
          "examRelevance": 4
        }
      },
      {
        "name": "Patient on anti-coagulant therapy",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 9
        }
      },
      {
        "name": "Patient on anti-platelet therapy",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 9
        }
      },
      {
        "name": "Polycythaemia",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 5
        }
      },
      {
        "name": "Pulmonary embolism",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Sickle cell disease",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 4,
          "examRelevance": 5
        }
      },
      {
        "name": "Transfusion reactions",
        "ratings": {
          "difficulty": 9,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      }
    ]
  },
  {
    "name": "Clinical Imaging",
    "topics": [
      {
        "name": "Aneurysms, ischaemic limb and occlusions",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 5,
          "examRelevance": 3
        }
      },
      {
        "name": "Bladder cancer",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Breast cancer",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Bronchiectasis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      },
      {
        "name": "Cardiac failure",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 9,
          "examRelevance": 8
        }
      },
      {
        "name": "Colorectal tumours",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 8,
          "examRelevance": 7
        }
      },
      {
        "name": "Extradural haemorrhage",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 7
        }
      },
      {
        "name": "Intestinal ischaemia",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Intestinal obstruction and ileus",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 4
        }
      },
      {
        "name": "Intussusception",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      },
      {
        "name": "Lower limb fractures",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Lower limb soft tissue injury",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Lung cancer",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Osteomyelitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Pathological fracture",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 6,
          "examRelevance": 4
        }
      },
      {
        "name": "Placenta praevia",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 9,
          "examRelevance": 5
        }
      },
      {
        "name": "Pneumonia",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Pneumothorax",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Pulmonary embolism",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Raised intracranial pressure",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 6,
          "examRelevance": 6
        }
      },
      {
        "name": "Spinal cord compression",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Spinal cord injury",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 4
        }
      },
      {
        "name": "Spinal fracture",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Stroke",
        "ratings": {
          "difficulty": 9,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Subarachnoid haemorrhage",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Subdural haemorrhage",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Surgical site infection",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 7,
          "examRelevance": 4
        }
      },
      {
        "name": "Upper limb fractures",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Upper limb soft tissue injury",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 2,
          "examRelevance": 2
        }
      },
      {
        "name": "Volvulus",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 8,
          "examRelevance": 6
        }
      }
    ]
  },
  {
    "name": "ENT",
    "topics": [
      {
        "name": "Acoustic neuroma",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Benign paroxysmal positional vertigo",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Epiglottitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 7
        }
      },
      {
        "name": "Epistaxis",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 9,
          "examRelevance": 6
        }
      },
      {
        "name": "Infectious mononucleosis",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 5
        }
      },
      {
        "name": "Me\u0301nie\u0300re's disease",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 6
        }
      },
      {
        "name": "Obstructive sleep apnoea",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 2
        }
      },
      {
        "name": "Otitis externa",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Otitis media",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Rhinosinusitis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 2,
          "examRelevance": 1
        }
      },
      {
        "name": "Tonsillitis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      }
    ]
  },
  {
    "name": "Dermatology",
    "topics": [
      {
        "name": "Acne vulgaris",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      },
      {
        "name": "Arterial ulcers",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 8
        }
      },
      {
        "name": "Atopic dermatitis and eczema",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 7,
          "examRelevance": 9
        }
      },
      {
        "name": "Basal cell carcinoma",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Cellulitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Contact dermatitis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 3,
          "examRelevance": 5
        }
      },
      {
        "name": "Cutaneous fungal infection",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Cutaneous warts",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 3
        }
      },
      {
        "name": "Folliculitis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 2,
          "examRelevance": 1
        }
      },
      {
        "name": "Head lice",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 2,
          "examRelevance": 1
        }
      },
      {
        "name": "Impetigo",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 3,
          "examRelevance": 5
        }
      },
      {
        "name": "Malignant melanoma",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Pressure sores",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Psoriasis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Scabies",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 3
        }
      },
      {
        "name": "Squamous cell carcinoma",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Urticaria",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 5
        }
      }
    ]
  },
  {
    "name": "MSK",
    "topics": [
      {
        "name": "Ankylosing spondylitis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      },
      {
        "name": "Bursitis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 3,
          "examRelevance": 1
        }
      },
      {
        "name": "Compartment syndrome",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 6
        }
      },
      {
        "name": "Crystal arthropathy",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Fibromyalgia",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 4,
          "examRelevance": 1
        }
      },
      {
        "name": "Idiopathic arthritis",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Inflammatory bowel disease",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 6,
          "examRelevance": 9
        }
      },
      {
        "name": "Lower limb fractures",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Lower limb soft tissue injury",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Lyme disease",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Metastatic disease",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Non-accidental injury",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Osteoarthritis",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Osteomalacia",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 5,
          "examRelevance": 4
        }
      },
      {
        "name": "Osteomyelitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Osteoporosis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Pathological fracture",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 6,
          "examRelevance": 4
        }
      },
      {
        "name": "Polymyalgia rheumatica",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      },
      {
        "name": "Psoriasis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Radiculopathies",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Reactive arthritis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 3,
          "examRelevance": 4
        }
      },
      {
        "name": "Rheumatoid arthritis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Sarcoidosis",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Septic arthritis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Spinal cord compression",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Spinal cord injury",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 4
        }
      },
      {
        "name": "Spinal fracture",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Systemic lupus erythematosus",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 6,
          "examRelevance": 9
        }
      },
      {
        "name": "Upper limb fractures",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Upper limb soft tissue injury",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 2,
          "examRelevance": 2
        }
      }
    ]
  },
  {
    "name": "Mental Health",
    "topics": [
      {
        "name": "Acute stress reaction",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 2,
          "examRelevance": 1
        }
      },
      {
        "name": "Alcoholic hepatitis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 6
        }
      },
      {
        "name": "Anxiety disorder: generalised",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Anxiety disorder: post-traumatic stress disorder",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 3,
          "examRelevance": 3
        }
      },
      {
        "name": "Anxiety, phobias, OCD",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 2,
          "examRelevance": 2
        }
      },
      {
        "name": "Attention deficit hyperactivity disorder",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 2,
          "examRelevance": 3
        }
      },
      {
        "name": "Autism spectrum disorder",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Bipolar affective disorder",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 6
        }
      },
      {
        "name": "Delirium",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 9,
          "examRelevance": 7
        }
      },
      {
        "name": "Dementias",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Depression",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Drug overdose",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Eating disorders",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Personality disorder",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Schizophrenia",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 10
        }
      },
      {
        "name": "Self-harm",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 5,
          "examRelevance": 3
        }
      },
      {
        "name": "Somatisation",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 2,
          "examRelevance": 2
        }
      },
      {
        "name": "Substance use disorder",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Tension headache",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 4,
          "examRelevance": 6
        }
      },
      {
        "name": "Wernicke's encephalopathy",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 9,
          "examRelevance": 8
        }
      }
    ]
  },
  {
    "name": "Infection",
    "topics": [
      {
        "name": "Acute cholangitis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      },
      {
        "name": "Brain abscess",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 3
        }
      },
      {
        "name": "Breast abscess/ mastitis",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 5,
          "examRelevance": 3
        }
      },
      {
        "name": "Candidiasis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Cellulitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Chlamydia",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Conjunctivitis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Covid-19",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Croup",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Cutaneous fungal infection",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Cutaneous warts",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 3
        }
      },
      {
        "name": "Encephalitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 7
        }
      },
      {
        "name": "Epididymitis and orchitis",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 2
        }
      },
      {
        "name": "Folliculitis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 2,
          "examRelevance": 1
        }
      },
      {
        "name": "Gangrene",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Gonorrhoea",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 6
        }
      },
      {
        "name": "Head lice",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 2,
          "examRelevance": 1
        }
      },
      {
        "name": "Herpes simplex virus",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 4,
          "examRelevance": 5
        }
      },
      {
        "name": "Hospital acquired infections",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Human immunodeficiency virus",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Human papilloma virus infection",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 6,
          "examRelevance": 6
        }
      },
      {
        "name": "Impetigo",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 3,
          "examRelevance": 5
        }
      },
      {
        "name": "Infectious colitis",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Infectious diarrhoea",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Infectious mononucleosis",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 5
        }
      },
      {
        "name": "Infective endocarditis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 8,
          "examRelevance": 9
        }
      },
      {
        "name": "Influenza",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Lower respiratory tract infection",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 9
        }
      },
      {
        "name": "Lyme disease",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Malaria",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 2,
          "examRelevance": 3
        }
      },
      {
        "name": "Measles",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Meningitis",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Mumps",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 3,
          "examRelevance": 2
        }
      },
      {
        "name": "Necrotising fasciitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 4
        }
      },
      {
        "name": "Notifiable diseases",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 6,
          "examRelevance": 3
        }
      },
      {
        "name": "Osteomyelitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Otitis media",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Perianal abscesses and fistulae",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 3,
          "examRelevance": 2
        }
      },
      {
        "name": "Periorbital and orbital cellulitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Peritonitis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 5,
          "examRelevance": 4
        }
      },
      {
        "name": "Pneumonia",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Sepsis",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Septic arthritis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Surgical site infection",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 7,
          "examRelevance": 4
        }
      },
      {
        "name": "Syphilis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Tonsillitis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      }
    ]
  },
  {
    "name": "GI",
    "topics": [
      {
        "name": "Acute cholangitis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      },
      {
        "name": "Acute pancreatitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 6,
          "examRelevance": 8
        }
      },
      {
        "name": "Alcoholic hepatitis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 6
        }
      },
      {
        "name": "Anaemia",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Anal fissure",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Appendicitis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Ascites",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 4
        }
      },
      {
        "name": "Cholecystitis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      },
      {
        "name": "Cirrhosis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 6
        }
      },
      {
        "name": "Coeliac disease",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Colorectal tumours",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 8,
          "examRelevance": 7
        }
      },
      {
        "name": "Constipation",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 8,
          "examRelevance": 6
        }
      },
      {
        "name": "Diverticular disease",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 5,
          "examRelevance": 4
        }
      },
      {
        "name": "Eating disorders",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Gallstones and biliary colic",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Gastric cancer",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 8,
          "examRelevance": 7
        }
      },
      {
        "name": "Gastrointestinal perforation",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Gastro-oesophageal reflux disease",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 7,
          "examRelevance": 9
        }
      },
      {
        "name": "Haemochromatosis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 3,
          "examRelevance": 4
        }
      },
      {
        "name": "Haemorrhoids",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 4,
          "examRelevance": 2
        }
      },
      {
        "name": "Hepatitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Hernias",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 2,
          "examRelevance": 3
        }
      },
      {
        "name": "Hiatus hernia",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 2,
          "examRelevance": 2
        }
      },
      {
        "name": "Hyposplenism/splenectomy",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Infectious colitis",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Infectious mononucleosis",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 5
        }
      },
      {
        "name": "Inflammatory bowel disease",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 6,
          "examRelevance": 9
        }
      },
      {
        "name": "Irritable bowel syndrome",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Liver failure",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 6
        }
      },
      {
        "name": "Malabsorption",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 3
        }
      },
      {
        "name": "Malnutrition",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 3
        }
      },
      {
        "name": "Mesenteric adenitis",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 4
        }
      },
      {
        "name": "Necrotising enterocolitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Oesophageal cancer",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Pancreatic cancer",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      },
      {
        "name": "Peptic ulcer disease and gastritis",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 6
        }
      },
      {
        "name": "Perianal abscesses and fistulae",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 3,
          "examRelevance": 2
        }
      },
      {
        "name": "Peritonitis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 5,
          "examRelevance": 4
        }
      },
      {
        "name": "Vitamin B12 and/or folate deficiency",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 7,
          "examRelevance": 9
        }
      }
    ]
  },
  {
    "name": "Older adult",
    "topics": [
      {
        "name": "Benign paroxysmal positional vertigo",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Cardiac failure",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 9,
          "examRelevance": 8
        }
      },
      {
        "name": "Delirium",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 9,
          "examRelevance": 7
        }
      },
      {
        "name": "Dementias",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Hyperthermia and hypothermia",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 6,
          "examRelevance": 3
        }
      },
      {
        "name": "Lower limb fractures",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Malnutrition",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 3
        }
      },
      {
        "name": "Non-accidental injury",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Osteoporosis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Parkinson's disease",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 6,
          "examRelevance": 8
        }
      },
      {
        "name": "Pressure sores",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Stroke",
        "ratings": {
          "difficulty": 9,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Urinary incontinence",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      }
    ]
  },
  {
    "name": "GP",
    "topics": [
      {
        "name": "Acne vulgaris",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      },
      {
        "name": "Acute bronchitis",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Acute stress reaction",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 2,
          "examRelevance": 1
        }
      },
      {
        "name": "Allergic disorder",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 9,
          "examRelevance": 7
        }
      },
      {
        "name": "Anaemia",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Anal fissure",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Anaphylaxis",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Anxiety disorder: generalised",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Anxiety, phobias, OCD",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 3,
          "examRelevance": 3
        }
      },
      {
        "name": "Arrhythmias",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Asthma",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 9,
          "examRelevance": 10
        }
      },
      {
        "name": "Atopic dermatitis and eczema",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 7,
          "examRelevance": 9
        }
      },
      {
        "name": "Atrophic vaginitis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 3,
          "examRelevance": 3
        }
      },
      {
        "name": "Bacterial vaginosis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Bell's palsy",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Benign eyelid disorders",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 3,
          "examRelevance": 2
        }
      },
      {
        "name": "Benign paroxysmal positional vertigo",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Benign prostatic hyperplasia",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 3
        }
      },
      {
        "name": "Breast abscess/ mastitis",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 5,
          "examRelevance": 3
        }
      },
      {
        "name": "Bronchiolitis",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 2
        }
      },
      {
        "name": "Bursitis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 3,
          "examRelevance": 1
        }
      },
      {
        "name": "Candidiasis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Chlamydia",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Chronic fatigue syndrome",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Chronic kidney disease",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 8,
          "examRelevance": 6
        }
      },
      {
        "name": "Chronic obstructive pulmonary disease",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Conjunctivitis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Constipation",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 8,
          "examRelevance": 6
        }
      },
      {
        "name": "Contact dermatitis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 3,
          "examRelevance": 5
        }
      },
      {
        "name": "Croup",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Crystal arthropathy",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Cutaneous fungal infection",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Cutaneous warts",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 3
        }
      },
      {
        "name": "Dementias",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Depression",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Diabetes mellitus type 1 and 2",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 9
        }
      },
      {
        "name": "Disease prevention/screening",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 3,
          "examRelevance": 4
        }
      },
      {
        "name": "Diverticular disease",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 5,
          "examRelevance": 4
        }
      },
      {
        "name": "Essential or secondary hypertension",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 6
        }
      },
      {
        "name": "Fibromyalgia",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 4,
          "examRelevance": 1
        }
      },
      {
        "name": "Folliculitis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 2,
          "examRelevance": 1
        }
      },
      {
        "name": "Gastro-oesophageal reflux disease",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 7,
          "examRelevance": 9
        }
      },
      {
        "name": "Gonorrhoea",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 6
        }
      },
      {
        "name": "Haemorrhoids",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 4,
          "examRelevance": 2
        }
      },
      {
        "name": "Herpes simplex virus",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 4,
          "examRelevance": 5
        }
      },
      {
        "name": "Hiatus hernia",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 2,
          "examRelevance": 2
        }
      },
      {
        "name": "Hypothyroidism",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Impetigo",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 3,
          "examRelevance": 5
        }
      },
      {
        "name": "Infectious mononucleosis",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 5
        }
      },
      {
        "name": "Influenza",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Irritable bowel syndrome",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Lower limb soft tissue injury",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Lyme disease",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Measles",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Menopause",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 4,
          "examRelevance": 2
        }
      },
      {
        "name": "Migraine",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 3,
          "examRelevance": 5
        }
      },
      {
        "name": "Mumps",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 3,
          "examRelevance": 2
        }
      },
      {
        "name": "Obesity",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 7,
          "examRelevance": 6
        }
      },
      {
        "name": "Osteoarthritis",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Osteoporosis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Otitis externa",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Otitis media",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Parkinson's disease",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 6,
          "examRelevance": 8
        }
      },
      {
        "name": "Pelvic inflammatory disease",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Peripheral vascular disease",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Polymyalgia rheumatica",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      },
      {
        "name": "Prostate cancer",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Psoriasis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Radiculopathies",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Reactive arthritis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 3,
          "examRelevance": 4
        }
      },
      {
        "name": "Rhinosinusitis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 2,
          "examRelevance": 1
        }
      },
      {
        "name": "Substance use disorder",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Syphilis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Tension headache",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 4,
          "examRelevance": 6
        }
      },
      {
        "name": "Tonsillitis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      },
      {
        "name": "Trichomonas vaginalis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 2,
          "examRelevance": 4
        }
      },
      {
        "name": "Trigeminal neuralgia",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      },
      {
        "name": "Upper limb soft tissue injury",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 2,
          "examRelevance": 2
        }
      },
      {
        "name": "Urinary incontinence",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      },
      {
        "name": "Urinary tract infection",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 9,
          "examRelevance": 10
        }
      },
      {
        "name": "Urticaria",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 5
        }
      },
      {
        "name": "Varicella zoster",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 4
        }
      },
      {
        "name": "Varicose veins",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Vasovagal syncope",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Venous ulcers",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 7
        }
      },
      {
        "name": "Viral exanthema",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 7,
          "examRelevance": 9
        }
      },
      {
        "name": "Viral gastroenteritis",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 3,
          "examRelevance": 2
        }
      },
      {
        "name": "Whooping cough",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 6,
          "examRelevance": 4
        }
      }
    ]
  },
  {
    "name": "Obs/Gyn",
    "topics": [
      {
        "name": "Anaemia",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Atrophic vaginitis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 3,
          "examRelevance": 3
        }
      },
      {
        "name": "Bacterial vaginosis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Cervical cancer",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Cervical screening (HPV)",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 6,
          "examRelevance": 8
        }
      },
      {
        "name": "Chlamydia",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Cord prolapse",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Depression",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Diabetes in pregnancy (gestational and pre- existing)",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      },
      {
        "name": "Ectopic pregnancy",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Endometrial cancer",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Endometriosis",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Epilepsy",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      },
      {
        "name": "Essential or secondary hypertension",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 6
        }
      },
      {
        "name": "Fibroids",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 6
        }
      },
      {
        "name": "Gonorrhoea",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 6
        }
      },
      {
        "name": "Menopause",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 4,
          "examRelevance": 2
        }
      },
      {
        "name": "Obesity and pregnancy",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Ovarian cancer",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 6,
          "examRelevance": 6
        }
      },
      {
        "name": "Pelvic inflammatory disease",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Placenta praevia",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 9,
          "examRelevance": 5
        }
      },
      {
        "name": "Placental abruption",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 9,
          "examRelevance": 5
        }
      },
      {
        "name": "Postpartum haemorrhage",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 9,
          "examRelevance": 6
        }
      },
      {
        "name": "Pre-eclampsia, gestational hypertension",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Sepsis",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Substance use disorder",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Syphilis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Termination of pregnancy",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Trichomonas vaginalis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 2,
          "examRelevance": 4
        }
      },
      {
        "name": "Urinary incontinence",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      },
      {
        "name": "Urinary tract infection",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 9,
          "examRelevance": 10
        }
      },
      {
        "name": "Varicella zoster",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 4
        }
      },
      {
        "name": "Vasa praevia",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 9,
          "examRelevance": 5
        }
      },
      {
        "name": "VTE in pregnancy and puerperium",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      }
    ]
  },
  {
    "name": "Respiratory",
    "topics": [
      {
        "name": "Acute bronchitis",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Allergic disorder",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 9,
          "examRelevance": 7
        }
      },
      {
        "name": "Asbestos-related lung disease",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      },
      {
        "name": "Asthma",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 9,
          "examRelevance": 10
        }
      },
      {
        "name": "COPD overlap syndrome",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 2,
          "examRelevance": 1
        }
      },
      {
        "name": "Bronchiectasis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      },
      {
        "name": "Bronchiolitis",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 2
        }
      },
      {
        "name": "Chronic obstructive pulmonary disease",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Cystic fibrosis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 7,
          "examRelevance": 6
        }
      },
      {
        "name": "Fibrotic lung disease",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Influenza",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Lower respiratory tract infection",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 9
        }
      },
      {
        "name": "Lung cancer",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Metastatic disease",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Obstructive sleep apnoea",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 2
        }
      },
      {
        "name": "Occupational lung disease",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      },
      {
        "name": "Pneumonia",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Pneumothorax",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Pulmonary embolism",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Pulmonary hypertension",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 6,
          "examRelevance": 6
        }
      },
      {
        "name": "Respiratory failure",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Sarcoidosis",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Tuberculosis",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      },
      {
        "name": "Upper respiratory tract infection",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      }
    ]
  },
  {
    "name": "Sexual health",
    "topics": [
      {
        "name": "Chlamydia",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Gonorrhoea",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 6
        }
      },
      {
        "name": "Syphilis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Erectile dysfunction",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Loss of libido",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      }
    ]
  },
  {
    "name": "Renal and urology",
    "topics": [
      {
        "name": "Acute kidney injury",
        "ratings": {
          "difficulty": 10,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Benign prostatic hyperplasia",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 3
        }
      },
      {
        "name": "Bladder cancer",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Chronic kidney disease",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 8,
          "examRelevance": 6
        }
      },
      {
        "name": "Dehydration",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 6
        }
      },
      {
        "name": "Diabetes insipidus",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Diabetic nephropathy",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Epididymitis and orchitis",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 2
        }
      },
      {
        "name": "Multiple myeloma",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Nephrotic syndrome",
        "ratings": {
          "difficulty": 10,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Prostate cancer",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Testicular cancer",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Urinary incontinence",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      },
      {
        "name": "Urinary tract calculi",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 5,
          "examRelevance": 4
        }
      },
      {
        "name": "Urinary tract infection",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 9,
          "examRelevance": 10
        }
      }
    ]
  },
  {
    "name": "Endocrine and metabolic",
    "topics": [
      {
        "name": "Addison's disease",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 6
        }
      },
      {
        "name": "Cushing\u2019s syndrome",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Diabetes in pregnancy (gestational and pre- existing)",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      },
      {
        "name": "Diabetes insipidus",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Diabetes mellitus type 1 and 2",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 9
        }
      },
      {
        "name": "Diabetic ketoacidosis",
        "ratings": {
          "difficulty": 9,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Diabetic nephropathy",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Diabetic neuropathy",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Essential or secondary hypertension",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 6
        }
      },
      {
        "name": "Hypercalcaemia of malignancy",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Hyperlipidemia",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 6,
          "examRelevance": 6
        }
      },
      {
        "name": "Hyperosmolar hyperglycaemic state",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 6,
          "examRelevance": 6
        }
      },
      {
        "name": "Hyperparathyroidism",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 4,
          "examRelevance": 6
        }
      },
      {
        "name": "Hyperthermia and hypothermia",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 6,
          "examRelevance": 3
        }
      },
      {
        "name": "Hypoglycaemia",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 5,
          "examRelevance": 4
        }
      },
      {
        "name": "Hypoparathyroidism",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 4,
          "examRelevance": 5
        }
      },
      {
        "name": "Hypothyroidism",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Obesity",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 7,
          "examRelevance": 6
        }
      },
      {
        "name": "Osteomalacia",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 4
        }
      },
      {
        "name": "Osteoporosis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Peripheral vascular disease",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Pituitary tumours",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Thyroid eye disease",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 5,
          "examRelevance": 2
        }
      },
      {
        "name": "Thyroid nodules",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 3,
          "examRelevance": 2
        }
      },
      {
        "name": "Thyrotoxicosis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      }
    ]
  },
  {
    "name": "Surgery",
    "topics": [
      {
        "name": "Acute pancreatitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 6,
          "examRelevance": 8
        }
      },
      {
        "name": "Anal fissure",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Aortic aneurysm",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Aortic dissection",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Aortic valve disease",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Appendicitis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Breast abscess/ mastitis",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 5,
          "examRelevance": 3
        }
      },
      {
        "name": "Breast cancer",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Breast cysts",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Colorectal tumours",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 8,
          "examRelevance": 7
        }
      },
      {
        "name": "Fibroadenoma",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      },
      {
        "name": "Fibroids",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 6
        }
      },
      {
        "name": "Gastrointestinal perforation",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 6,
          "examRelevance": 5
        }
      },
      {
        "name": "Hernias",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 2,
          "examRelevance": 3
        }
      },
      {
        "name": "Intestinal ischaemia",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Intestinal obstruction and ileus",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 4
        }
      },
      {
        "name": "Intussusception",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      },
      {
        "name": "Oesophageal cancer",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 3
        }
      },
      {
        "name": "Ovarian cancer",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 6,
          "examRelevance": 6
        }
      },
      {
        "name": "Pancreatic cancer",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      },
      {
        "name": "Pelvic inflammatory disease",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Perianal abscesses and fistulae",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 3,
          "examRelevance": 2
        }
      },
      {
        "name": "Peritonitis",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 5,
          "examRelevance": 4
        }
      },
      {
        "name": "Postpartum haemorrhage",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 9,
          "examRelevance": 6
        }
      },
      {
        "name": "Surgical site infection",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 7,
          "examRelevance": 4
        }
      },
      {
        "name": "Testicular cancer",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Testicular torsion",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 7,
          "examRelevance": 4
        }
      },
      {
        "name": "Varicose veins",
        "ratings": {
          "difficulty": 1,
          "clinicalImportance": 1,
          "examRelevance": 1
        }
      },
      {
        "name": "Volvulus",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 8,
          "examRelevance": 6
        }
      }
    ]
  },
  {
    "name": "Periop and anaesthetics",
    "topics": [
      {
        "name": "Acute kidney injury",
        "ratings": {
          "difficulty": 10,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Anaemia",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Anaphylaxis",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Aortic valve disease",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Arrhythmias",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Asthma",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 9,
          "examRelevance": 10
        }
      },
      {
        "name": "Cardiac arrest",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Cardiac failure",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 9,
          "examRelevance": 8
        }
      },
      {
        "name": "Chronic kidney disease",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 8,
          "examRelevance": 6
        }
      },
      {
        "name": "Chronic obstructive pulmonary disease",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Deep vein thrombosis",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Dehydration",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 6
        }
      },
      {
        "name": "Diabetes mellitus type 1 and 2",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 9
        }
      },
      {
        "name": "Drug overdose",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Epiglottitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 7
        }
      },
      {
        "name": "Essential or secondary hypertension",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 4,
          "examRelevance": 6
        }
      },
      {
        "name": "Gastro-oesophageal reflux disease",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 7,
          "examRelevance": 9
        }
      },
      {
        "name": "Intestinal obstruction and ileus",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 4
        }
      },
      {
        "name": "Necrotising fasciitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 4
        }
      },
      {
        "name": "Obesity",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 7,
          "examRelevance": 6
        }
      },
      {
        "name": "Obstructive sleep apnoea",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 4,
          "examRelevance": 2
        }
      },
      {
        "name": "Patient on anti-platelet therapy",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 9
        }
      },
      {
        "name": "Placenta praevia",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 9,
          "examRelevance": 5
        }
      },
      {
        "name": "Placental abruption",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 9,
          "examRelevance": 5
        }
      },
      {
        "name": "Postpartum haemorrhage",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 9,
          "examRelevance": 6
        }
      },
      {
        "name": "Pre-eclampsia, gestational hypertension",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Respiratory arrest",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 8,
          "examRelevance": 6
        }
      },
      {
        "name": "Respiratory failure",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 7,
          "examRelevance": 7
        }
      },
      {
        "name": "Sepsis",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 10,
          "examRelevance": 10
        }
      },
      {
        "name": "Substance use disorder",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Surgical site infection",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 7,
          "examRelevance": 4
        }
      }
    ]
  },
  {
    "name": "Palliative and end of life",
    "topics": [
      {
        "name": "Cardiac failure",
        "ratings": {
          "difficulty": 8,
          "clinicalImportance": 9,
          "examRelevance": 8
        }
      },
      {
        "name": "Metastatic disease",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "Multi-organ dysfunction syndrome",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 4,
          "examRelevance": 4
        }
      },
      {
        "name": "Acute and chronic pain management",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 9,
          "examRelevance": 9
        }
      },
      {
        "name": "End of life care/symptoms of terminal illness",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 8,
          "examRelevance": 8
        }
      },
      {
        "name": "Nausea",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 7,
          "examRelevance": 9
        }
      },
      {
        "name": "Neuromuscular weakness",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 4
        }
      }
    ]
  },
  {
    "name": "Ophthalmology",
    "topics": [
      {
        "name": "Acute glaucoma",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 8,
          "examRelevance": 9
        }
      },
      {
        "name": "Benign eyelid disorders",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 3,
          "examRelevance": 2
        }
      },
      {
        "name": "Blepharitis",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 3,
          "examRelevance": 2
        }
      },
      {
        "name": "Cataracts",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Central retinal arterial occlusion",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 6
        }
      },
      {
        "name": "Chronic glaucoma",
        "ratings": {
          "difficulty": 5,
          "clinicalImportance": 4,
          "examRelevance": 5
        }
      },
      {
        "name": "Conjunctivitis",
        "ratings": {
          "difficulty": 2,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Diabetic eye disease",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      },
      {
        "name": "Infective keratitis",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 7
        }
      },
      {
        "name": "Iritis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      },
      {
        "name": "Macular degeneration",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      },
      {
        "name": "Optic neuritis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      },
      {
        "name": "Periorbital and orbital cellulitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      },
      {
        "name": "Retinal detachment",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 6,
          "examRelevance": 7
        }
      },
      {
        "name": "Scleritis",
        "ratings": {
          "difficulty": 4,
          "clinicalImportance": 5,
          "examRelevance": 5
        }
      },
      {
        "name": "Thyroid eye disease",
        "ratings": {
          "difficulty": 3,
          "clinicalImportance": 5,
          "examRelevance": 2
        }
      },
      {
        "name": "Uveitis",
        "ratings": {
          "difficulty": 6,
          "clinicalImportance": 5,
          "examRelevance": 6
        }
      },
      {
        "name": "Visual field defects",
        "ratings": {
          "difficulty": 7,
          "clinicalImportance": 7,
          "examRelevance": 8
        }
      }
    ]
  }
];

export default masterSubjects;
