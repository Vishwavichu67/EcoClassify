export interface ReportSection {
  id: string;
  number: string;
  title: string;
  content: string[];
  bulletPoints?: string[];
  tableData?: { headers: string[]; rows: string[][] };
}

export const PROJECT_REPORT_META = {
  title: "DETAILED PROJECT REPORT: Waste Segregation and Recycling Classifier",
  subtitle: "Deep Learning Classifier • Flask + Vercel • Hugging Face Inference API • Feedback-driven Learning",
  revision: "Revision 2.0",
  date: "5 August 2026",
  preparedFor: "Internship / Professional Project Proposal",
  author: "EcoClassify Engineering Team",
};

export const REPORT_SECTIONS: ReportSection[] = [
  {
    id: "summary",
    number: "1",
    title: "Summary",
    content: [
      "This project delivers an image-based waste classification system that identifies common waste categories (plastic, paper/cardboard, metal, glass, organic, general trash, hazardous e-waste) and returns the correct recycling guidance.",
      "The deep learning model is hosted and served through the Hugging Face Inference API, keeping heavy compute off the web server. The user-facing Flask application is deployed as a lightweight app on Vercel for free, fast, globally distributed hosting.",
      "A feedback loop lets users flag incorrect predictions; these corrections are stored and used in periodic fine-tuning cycles, so the model progressively improves from its own past mistakes rather than staying static after initial training.",
    ],
  },
  {
    id: "introduction",
    number: "2",
    title: "Introduction",
    content: [
      "Incorrect waste segregation at the point of disposal is a major cause of recycling loss and landfill overload. This project builds an accessible, browser-based tool that classifies a photographed waste item and tells the user how to dispose of it correctly — no app install or special hardware required.",
      "The architecture is deliberately split into a thin, free-tier-friendly web layer (Flask on Vercel) and a managed inference layer (Hugging Face), so the project stays inexpensive to host while still using a full deep learning model.",
    ],
  },
  {
    id: "problem-statement",
    number: "3",
    title: "Problem Statement",
    content: [
      "Households and small facilities lack a fast, low-cost way to check how to dispose of a waste item.",
      "Static, one-time-trained classifiers do not improve after deployment, so recurring misclassifications go uncorrected.",
      "Self-hosting a deep learning model is often too costly or slow for a small-scale, free-tier deployment.",
    ],
    bulletPoints: [
      "Lack of accessible point-of-disposal guidance for non-experts.",
      "Frozen model performance in traditional ML deployments.",
      "High server costs for running GPU-intensive computer vision workloads.",
    ],
  },
  {
    id: "objectives",
    number: "4",
    title: "Objectives",
    content: [
      "Build a deep learning image classifier for common waste categories and host it on the Hugging Face Inference API.",
      "Deploy a responsive Flask web application on Vercel that calls the Hugging Face model and displays predictions with recycling guidance.",
      "Add a feedback mechanism so users can mark a prediction right/wrong, feeding a periodic retraining cycle (reinforcement from past mistakes).",
      "Keep the entire stack on free-tier services to minimize cost while remaining production-viable.",
      "Deliver a working, demoable prototype with a clear path to scaling.",
    ],
  },
  {
    id: "literature-survey",
    number: "5",
    title: "Literature Survey",
    content: [
      "Academic CNN classifiers trained on datasets such as TrashNet or the Kaggle Garbage Classification dataset typically report 85–95% accuracy on 6–12 category splits, but are usually evaluated offline and are not paired with a feedback/retraining loop.",
      "Commercial smart-bin products combine a camera with an embedded classifier and physical sorting hardware, aimed at large facilities rather than individual households. Most public mobile/web demos classify a single photo but do not close the loop on misclassifications or offer regionalized recycling guidance.",
      "This project differs by combining three things not usually found together: a managed, low-maintenance inference backend (Hugging Face), a near-zero-cost serverless frontend (Vercel), and a feedback-driven fine-tuning loop that lets the deployed model keep learning from real usage instead of remaining frozen after the first training run.",
    ],
  },
  {
    id: "proposed-system",
    number: "6",
    title: "Proposed System & Architecture",
    content: [
      "6.1 Architecture Overview: The system has two loops: a real-time prediction loop and a feedback/retraining loop.",
      "Prediction Loop: The Flask UI (hosted on Vercel) sends an uploaded image to a Vercel serverless API route, which forwards it to the Hugging Face Inference API for classification and returns the prediction with recycling guidance.",
      "Feedback Loop: Users can confirm or correct a prediction; corrections are logged to a feedback store (Hugging Face dataset or lightweight DB), and a periodic retraining job fine-tunes the model on this accumulated feedback before pushing an updated version back to the Hugging Face Model Hub — effectively letting the system reinforce itself against its own past mistakes.",
    ],
  },
  {
    id: "technology-stack",
    number: "7",
    title: "Technology Stack",
    content: ["The table below summarizes the layer components and justifications:"],
    tableData: {
      headers: ["Layer", "Technology", "Why / Rationale"],
      rows: [
        ["Frontend / Web App", "Flask (Python) + Jinja2 / React SPA", "Simple, familiar server-rendered UI for upload/capture and results"],
        ["Hosting / Deployment", "Vercel (serverless functions, free tier)", "Free, fast, auto-scaling hosting with zero server management"],
        ["Model Inference", "Hugging Face Inference API / Gemini Vision", "Offloads heavy DL compute from the free-tier host; free-tier friendly access"],
        ["Model Hosting", "Hugging Face Model Hub", "Central place to store, version, and update the trained model"],
        ["Model Architecture", "CNN via transfer learning (MobileNetV2 / EfficientNet)", "High accuracy with low compute cost, well suited to Hugging Face hosting"],
        ["Feedback Storage", "Hugging Face Datasets / SQLite / JSON Store", "Stores user corrections used for retraining"],
        ["Feedback Fine-tuning", "Periodic fine-tuning job (HF Space / Cron)", "Lets the model reinforce itself using accumulated user feedback"],
        ["Image Processing", "Pillow, OpenCV", "Preprocessing images before sending to the inference API"],
        ["Version Control", "Git / GitHub", "Source control; connects directly to Vercel for CI/CD deployment"],
      ],
    },
  },
  {
    id: "folder-structure",
    number: "8",
    title: "Initial Folder Structure & Blueprint",
    content: [
      "Repository layout for the production build (Flask/Express app structured for Vercel's serverless Python runtime, with model weights off-repo on Hugging Face Hub):",
    ],
    bulletPoints: [
      "waste-classifier/ | -- api/predict.py (Vercel serverless entry point)",
      "app/ (__init__.py, routes.py, inference.py, guidance.py, feedback.py, utils.py)",
      "templates/ (index.html, result.html, base.html)",
      "training/ (train.py, retrain.py, dataset_prep.py)",
      "data/class_guidance.json",
      "vercel.json & .env.example",
    ],
  },
];
