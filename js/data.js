// Portfolio content. Edit this file to change texts, order or media.
// Every `media` path is relative to /assets. If the file does not exist yet,
// the page shows a placeholder with the expected filename.
// Optional `ratio: "width / height"` (the capture's pixel size): the frame takes the
// capture's shape instead of cropping it. In carousels every slide keeps the same
// height and only the width changes.

window.PORTFOLIO = {
  person: {
    name: "Juan Saiz",
    role: "Technical Artist & Pipeline Developer",
    location: "Valencia, Spain",
    email: "juansaizn@gmail.com",
    linkedin: "https://www.linkedin.com/in/juan-saiz",
    cv: "assets/Juan_Saiz_CV.pdf",
    contactTitle: "Looking for a Technical Artist? Let's talk.",
  },

  hero: {
    kicker: "Technical Artist · Tools & pipelines for real‑time mobile",
    title: "I build the pipeline between the artist and the real‑time app.",
    text:
      "This is a portfolio of the tools I've built over the last few years, organized by the production stages they serve, from a PDF floor plan to the real‑time app. Most of them are private: they live in the company's internal repository, where I'm the sole author.",
  },

  impact: [
    { value: "2 h → 5 min", label: "to edit, save and export 40+ scenes", tool: "Quick Scene Switcher" },
    { value: "up to 6 h", label: "saved per project on the render farm", tool: "Render Farm Post‑Process" },
    { value: "up to 30%", label: "less time placing assets in Unity", tool: "Placement Tool" },
    { value: "12 tools", label: "one connected pipeline", tool: "3ds Max · Unity · Deadline" },
  ],

  output: { name: "Real‑time app", tools: "Unity · Babylon.js · Mobile/WebGL" },

  stages: [
    {
      id: "author",
      name: "Author",
      tagline: "From 2D reference to clean, bake‑ready 3D, with AI in the loop.",
      tools: ["3ds Max", "AI · MCP", "MaxScript", "Python"],
      featured: {
        name: "Floor Plan to 3D",
        stack: ["AI", "MCP", "3ds Max", "MaxScript", "Python"],
        lead:
          "AI‑assisted procedural generation: an AI skill drives 3ds Max through MCP to turn a 2D floor plan into 3D, and four more tools build, texture and unwrap it into a bake‑ready scene, in one connected chain.",
        media: "img/fp3d-pdf-splines.png", // provisional: luego video/fp3d-overview.mp4
        ratio: "1382 / 1141",
        impact: "50 min → 10 min per floor plan",
        featuresTitle: "Step by step.",
        features: [
          { title: "PDF to splines (AI)", text: "An AI skill drives 3ds Max through MCP: it reads the PDF plan and draws walls, floors and ceiling as named splines. In early production use.", media: "img/fp3d-pdf-splines.png", ratio: "1382 / 1141" },
          { title: "Shell Builder", text: "Extrudes the walls in height segments and builds the ceiling, floors and terrace borders from the splines.", media: "img/fp3d-shell-builder.png" },
          { title: "Door & Window Generator", text: "Places, orients and instances doors, windows and curtains, and fits their geometry to each opening.", media: "img/dwg-ui.png", ratio: "322 / 262" },
          { title: "MultiMaterial Editor", text: "Sets up the scene's materials in one organized multimaterial before unwrapping.", media: "img/mme-upgraded-ui.png", ratio: "3000 / 2280" },
          { title: "UnwrapAll", text: "Unwraps UVs by object type, packs them with UV‑Packer and leaves the scene ready to bake. Duplex layouts included.", media: "img/fp3d-unwrapall.png" },
        ],
      },
      support: [
        {
          name: "MultiMaterial Editor",
          stack: ["3ds Max", "Python", "Qt"],
          text:
            "As multimaterials grow complex, the native editor becomes a bottleneck. This tool replaces it with a UI built for teams: organized, fast and hard to break.",
          compare: {
            before: { media: "img/mme-native-ui.png", label: "Native 3ds Max UI", ratio: "470 / 487" },
            after: { media: "img/mme-upgraded-ui.png", ratio: "3000 / 2280", label: "MultiMaterial Editor" },
          },
          features: [
            { title: "Drag & drop reordering", text: "Reorder sub‑materials in a list instead of editing slots one by one.", media: "img/mme-drag-reorder.png", ratio: "1380 / 868" },
            { title: "Automatic ID renumbering", text: "Material IDs renumber themselves every time the list changes.", media: "img/mme-auto-renumber.png", ratio: "1460 / 972" },
            { title: "Linked names", text: "The slot name stays in sync with the material name.", media: "img/mme-name-link.png", ratio: "1244 / 824" },
            { title: "Auto‑apply to geometry", text: "Changed IDs are applied to the scene geometry, so meshes never drift out of sync.", media: "img/mme-auto-apply.png", ratio: "1516 / 1140" },
            { title: "Fix duplicated materials", text: "Cleans up the duplicates left behind by wrongly merged meshes.", media: "img/mme-fix-duplicates.png", ratio: "2028 / 1136" },
            { title: "Quick Slate access", text: "Jump straight to any sub‑material in the Slate Material Editor.", media: "img/mme-slate-access.png", ratio: "1192 / 744" },
            { title: "Fast iteration", text: "Step between materials quickly while you tweak them.", media: "img/mme-fast-iteration.png", ratio: "1460 / 1228" },
          ],
        },
        {
          name: "Quick Scene Switcher",
          stack: ["3ds Max", "Python", "Qt"],
          text:
            "Dockable panel to open and manage many scenes in a single 3ds Max instance, inspired by the Unity Editor. Edit 40+ scenes of a team project at once, then batch save and export with control.",
          impact: "2 h → 5 min",
          bullets: ["Drag & drop files or browse for them", "Batch save many scenes at once", "Batch FBX export many scenes at once", "Search, filter and sort the scene list"],
          media: "img/qss-ui.png",
          ratio: "1520 / 2144",
          features: [
            { title: "Drag & drop scenes", text: "Drop .max files or whole folders onto the list to load them as scenes.", media: "img/qss-drag-drop.png", ratio: "1456 / 1020" },
            { title: "Search, filter and sort", text: "Wildcards and sort commands narrow 40+ scenes down in a keystroke.", media: "img/qss-filter.png", ratio: "1456 / 928" },
            { title: "Batch save", text: "Mark scenes in green and save all of them in one go.", media: "img/qss-batch-save.png", ratio: "1456 / 1008" },
            { title: "Batch FBX export", text: "Scenes marked in red are exported together by OneClick Export.", media: "img/qss-batch-export.png", ratio: "1456 / 952" },
            { title: "External change detection", text: "Flags scenes changed on disk and offers to reload the active one.", media: "img/qss-external-change.png", ratio: "1456 / 1564" },
          ],
        },
        {
          name: "Door & Window Generator",
          stack: ["3ds Max", "MaxScript", "Qt"],
          text: "Analyzes the model topology to place doors, windows and curtains automatically, with controls to iterate fast.",
          bullets: ["Detects window orientation", "Picks the most suitable object", "Fits each object precisely"],
          media: "img/dwg-ui.png",
          ratio: "322 / 262",
          features: [
            { title: "Merges missing base objects", text: "When the base objects it needs are missing from the scene, it offers to merge them in.", media: "img/dwg-merge.png", ratio: "427 / 220" },
          ],
        },
      ],
    },

    {
      id: "bake-export",
      name: "Bake & Export",
      tagline: "Lighting baked in 3ds Max, delivered as lightweight real‑time assets.",
      tools: ["3ds Max", "MaxScript", "C#"],
      featured: {
        name: "Lightmapping & Web Exporter",
        stack: ["3ds Max", "MaxScript", "C#"],
        lead:
          "An in‑house solution built to control the final result and cut dependencies on third‑party tools. Custom materials, light baking and glTF export for real‑time visualization, all inside 3ds Max.",
        media: "img/lwe-ui.png",
        ratio: "510 / 585",
        features: [
          { title: "Lightmap baking", text: "Full control over texel density and an optimal texture atlas.", media: "video/lwe-lightmaps.mp4" },
          { title: "Furniture & camera placement", text: "Places furniture and cameras for the interactive app and writes them to JSON.", media: "video/lwe-placement-json.mp4" },
          { title: "Tagging with auto‑tag", text: "Tag assets by hand or let auto‑tagging do it for you.", media: "video/lwe-tagging.mp4" },
          { title: "Custom glTF exporter", text: "Exports glTF, lightmaps and JSON, including custom material attributes.", media: "video/lwe-gltf-export.mp4" },
        ],
      },
      support: [
        {
          name: "OneClick Export",
          stack: ["3ds Max", "MaxScript", "Qt"],
          text: "Exports hundreds of FBX files, fast, straight into the Unity project.",
          bullets: ["Connects to the Unity export path on its own", "Batch export based on the scene selection", "Scene validation: detects and fixes scene errors"],
          media: "video/oce-ui.mp4",
          features: [
            { title: "Unity export path", text: "Finds the Unity project path and exports there directly.", media: "video/oce-unity-path.mp4" },
            { title: "Batch export", text: "Exports every selected object as its own FBX.", media: "video/oce-batch-export.mp4" },
            { title: "Scene validation", text: "Detects scene errors and fixes them before exporting.", media: "img/oce-validation.png", ratio: "754 / 939" },
          ],
        },
      ],
    },

    {
      id: "assemble",
      name: "Assemble",
      tagline: "Unity scenes built from rules instead of by hand.",
      tools: ["Unity", "C#"],
      featured: {
        name: "Setup Location Scenes",
        stack: ["Unity", "C#"],
        lead:
          "Sets up location scenes automatically: it analyzes the model topology and places assets, cameras and materials based on multiple criteria.",
        media: "video/sls-ui.mp4",
        features: [
          { title: "Topology analysis", text: "Reads the model to decide where each element belongs.", media: "video/sls-topology.mp4" },
          { title: "Asset placement", text: "Places multiple assets from configurable criteria.", media: "video/sls-assets.mp4" },
          { title: "Cameras", text: "Positions the cameras of the interactive app automatically.", media: "video/sls-cameras.mp4" },
          { title: "Materials", text: "Assigns materials by rule across the whole scene.", media: "video/sls-materials.mp4" },
        ],
      },
      support: [
        {
          name: "Placement Tool",
          stack: ["Unity", "C#"],
          text: "Helps artists place elements quickly: depending on the selected asset, it snaps to floors, walls or ceilings.",
          impact: "up to 30% less time",
          media: "video/pt-ui.mp4",
        },
        {
          name: "Lazy Tagger",
          stack: ["Unity", "C#"],
          text: "Tags every asset in the scene from multiple rules, then generates and exports a JSON with all the information.",
          media: "video/lt-ui.mp4",
        },
        {
          name: "Kitchen Creator",
          stack: ["Unity", "C#"],
          text: "Modular generator to customize kitchen furniture.",
          media: "video/kc-ui.mp4",
        },
      ],
    },

    {
      id: "bake-ship",
      name: "Bake & Ship",
      tagline: "Dozens of scenes baked, processed and released without babysitting.",
      tools: ["Unity", "Deadline", "Python", "PowerShell"],
      featured: {
        name: "Render Farm Post‑Process",
        stack: ["Deadline", "Python", "PowerShell"],
        lead:
          "Handles all post‑render processing on the render farm, so finished renders become release‑ready files without manual steps.",
        impact: "up to 6 h saved per project",
        media: "img/rfp-ui.png", ratio: "2955 / 3918",
        features: [
          { title: "Distributed post‑production", text: "Spreads post‑production and BasisU compression across the farm.", media: "img/rfp-distributed.png", ratio: "3201 / 1848" },
          { title: "Self‑healing jobs", text: "Centralized error handling that relaunches failed tasks automatically.", media: "img/rfp-errors.png", ratio: "2339 / 1774" },
          { title: "Release folders", text: "Organizes the output files into release folders.", media: "img/rfp-release.png", ratio: "1878 / 1996" },
        ],
      },
      support: [
        {
          name: "Setup Baking Scenes",
          stack: ["Unity", "C#"],
          text: "Automation tool that sets up multiple baking scenes at once for a single project.",
          media: "video/sbs-ui.mp4",
        },
        {
          name: "Batch Baking",
          stack: ["Unity", "C#"],
          text: "Bakes multiple scenes at once and exports each one to its own folder, with extra control options.",
          media: "video/bb-ui.mp4",
        },
      ],
    },
  ],

  about:
    "Lead Technical Artist at Custhome, where I lead a team of 9 artists and keep the pipeline running from 3ds Max to WebGL and mobile. I came from 3D art, so I build tools the way artists want to use them: I remove the busywork and connect every piece of software in the studio so the team can focus on the creative side.",
};
