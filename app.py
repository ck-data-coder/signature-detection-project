from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
from PIL import Image
import io, base64, os
from fastapi.middleware.cors import CORSMiddleware
# Initialize FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Load YOLO model (update path if needed)
model = YOLO("models/best.pt")

# # Ensure crops folder exists
# os.makedirs("outputs/crops", exist_ok=True)

@app.post("/detect-signatures/")
async def detect_signatures(file: UploadFile = File(...)):
    # Read uploaded image
    img_bytes = await file.read()
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

    # Run YOLO detection
    results = model.predict(img)

    crops = []
    names = results[0].names  # class id -> name mapping

    for i, (box, cls) in enumerate(zip(results[0].boxes.xyxy, results[0].boxes.cls)):
        label = names[int(cls)]
        if label != "signature":  # Only keep signatures
            continue

        # Crop image
        x1, y1, x2, y2 = map(int, box.tolist())
        cropped = img.crop((x1, y1, x2, y2))

        # Save crop to file
        # save_path = f"outputs/crops/signature_{i}.png"
        # cropped.save(save_path)

        # Convert crop to base64
        buf = io.BytesIO()
        cropped.save(buf, format="PNG")
        base64_str = base64.b64encode(buf.getvalue()).decode("utf-8")

        crops.append({ "base64": base64_str})

    return {"signatures_found": len(crops), "crops": crops}
