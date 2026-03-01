# Snake Website Deployment

## Local preview

Run this in PowerShell from the project folder:

```powershell
python -m http.server 8000
```

Open `http://localhost:8000`.

## Deploy (GitHub Pages)

1. Create a GitHub repo and push these files: `index.html`, `style.css`, `game.js`.
2. In GitHub, go to `Settings -> Pages`.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`.
5. Save, then wait for the Pages URL to appear.

## Deploy (Netlify drag-and-drop)

1. Go to Netlify and open **Sites -> Add new site -> Deploy manually**.
2. Drag this project folder into the upload area.
3. Netlify will publish a URL immediately.
