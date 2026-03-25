# AstanaWalk RAG — Streamlit POI Search App

AstanaWalk RAG is an AI-powered assistant that helps users find interesting places in Astana based on their location, preferences, and intent.

The application demonstrates a Retrieval-Augmented Generation (RAG) approach:
- Retrieval — searching relevant POIs from a dataset  
- Generation — creating human-like recommendations with explanations  

This project is designed as a Smart City AI prototype for personalized urban exploration.

---

## Features

- Search nearby places (POI) by text query  
- Filter by distance (radius)  
- Category filtering (cafes, parks, shopping, etc.)  
- Mood-based recommendations (calm, active, romantic, etc.)  
- Interactive map with user location and POIs  
- Generated recommendations with explanations  
- Export results to CSV  

---

## How It Works (RAG)

1. User Input  
   The user enters:
   - query (e.g. "quiet cafe")
   - location (lat/lon)
   - radius, category, mood  

2. Retrieval  
   - Search in `poi_astana_only.csv`
   - Filter by:
     - text relevance  
     - distance (Haversine formula)  
     - category and mood  

3. Generation  
   - The system generates structured recommendations:
     - name  
     - distance  
     - rating  
     - explanation ("why this place")  

---

## Tech Stack

- Streamlit — UI framework  
- Python — core logic  
- Pandas — data processing  
- Haversine formula — distance calculation  
- CSV dataset — Astana POI database  

---

## Project Structure

```

├── app.py
├── poi_astana_only.csv
├── README.md

```

---

## Running the App

### 1. Install dependencies
```

pip install streamlit pandas

```

### 2. Run the app
```

streamlit run app.py

```

---

## Dataset

- Contains thousands of POIs in Astana  
- Includes:
  - name  
  - category  
  - coordinates (lat/lon)  
  - address  
  - rating  

---

## Example Queries

- "quiet cafe near me"  
- "park for walking"  
- "place to work with laptop"  
- "restaurant with a view"  

---

## Demo Use Cases

- Find cafes near Mega Silk Way  
- Discover parks for walking with children  
- Get restaurant suggestions for a romantic evening  
- Find cafes suitable for work and study  

---

## Links

Figma Design: https://www.figma.com/design/wMZh4WYApD49MoLnppUkLr/Streamlit-POI-Search-App  
GitHub Repo: https://github.com/Kamika-cyber/Streamlitpoisearchapp  

---

## Future Improvements

- Integration with LLMs (Gemini / OpenAI)  
- Real-time map APIs (Google Maps / OpenStreetMap)  
- Route generation (multi-point walking paths)  
- Mobile version (Flutter)  
- Multilingual support (EN / RU / KZ)  

---

## Ethics and Privacy

- No user data is stored  
- No authentication required  
- Uses only public POI data  
- Recommendations are informational, not authoritative  

---

## Team

- Kamila Issabay — Data Curator  
- Rakhima Yesmagambetova — ML / RAG Developer  
- Nuray Shokankyzy — QA and UX  
- Umit Baitleu — Presentation Lead  

---

## Summary

AstanaWalk RAG demonstrates how AI, open data, and geolocation can be combined to create useful and personalized smart city services.

It is a practical example of applying RAG in real-world applications.
