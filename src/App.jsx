import { useEffect, useRef, useState } from "react";
import "./App.css";
import Konva from "konva";
const App = () => {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const layerRef = useRef(null);
  const transformerRef = useRef(null);
  const [text, setText] = useState("");
  const [imageAdded, setImageAdded] = useState(false);
  const [textAdded, setTextAdded] = useState(false);
  const [fontSize, setFontSize] = useState(24);
  const videoRef = useRef(null);
  const videoNodeRef = useRef(null);
  const [videoAdded, setVideoAdded] = useState(false);
  const animRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [textColor, setTextColor] = useState("#000000");
  const [fontStyle, setFontStyle] = useState("Arial");
  const [currentVideo, setCurrentVideo] = useState(null);

  const [textContent, setTextContent] = useState("Editable Text");
  const [textareaVisible, setTextareaVisible] = useState(false);
  const [textareaPosition, setTextareaPosition] = useState({ x: 0, y: 0 });

  const handleText = (e) => {
    if (e.target.value.length < 0) {
      return;
    }
    setText(e.target.value);
  };
  useEffect(() => {
    stageRef.current = new Konva.Stage({
      container: containerRef.current,
      width: 450,
      height: 450,
    });

    const layer = new Konva.Layer();
    layerRef.current = layer;
    stageRef.current.add(layer);

    const transformer = new Konva.Transformer();
    transformerRef.current = transformer;
    layerRef.current.add(transformer);

    const handleResize = () => {
      stageRef.current.width(450);
      stageRef.current.height(450);
      stageRef.current.draw();
    };

    stageRef.current.on("click", (e) => {
      if (e.target === stageRef.current) {
        transformerRef.current.nodes([]);
        layerRef.current.draw();
      }
    });

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", () => {
        stageRef.current.width(450);
        stageRef.current.height(450);
        stageRef.current.draw();
      });
      stageRef.current.destroy();
    };
  }, []);
  const handleAddImage = () => {
    if (!imageAdded) {
      const imageObj = new window.Image();
      imageObj.src = "https://konvajs.org/assets/lion.png";
      imageObj.onload = function () {
        const konvaImage = new Konva.Image({
          x: 50,
          y: 50,
          image: imageObj,
          draggable: true,
        });

        // Save image reference for further use
        imageRef.current = konvaImage;

        // Add transformer for resizing
        const transformer = new Konva.Transformer();
        transformerRef.current = transformer;
        layerRef.current.add(transformer);

        konvaImage.on("click", () => {
          transformer.nodes([konvaImage]);
          layerRef.current.draw();
        });

        layerRef.current.add(konvaImage);
        layerRef.current.draw();
      };
      setImageAdded(true);
      // console.log("image added");
    } else {
      const image = layerRef.current.findOne("Image");
      console.log(layerRef.current);
      if (image) {
        layerRef.current.remove(image);
      }
      setImageAdded(false);
      layerRef.current.draw();
    }
  };

  const handleAddText = () => {
    if (!textAdded) {
      const textNode = new Konva.Text({
        x: 100,
        y: 100,
        text: text,
        fontSize: fontSize,
        draggable: true,
        fill: textColor,
        fontFamily: fontStyle,
      });
      textNode.on("dblclick dbltap", () => {
        const textPosition = textNode.getAbsolutePosition();
        const stageBox = stageRef.current.container().getBoundingClientRect();
        const areaPosition = {
          x: stageBox.left + textPosition.x,
          y: stageBox.top + textPosition.y,
        };

        // Show textarea
        setTextareaPosition(areaPosition);
        setTextContent(textNode.text());
        setTextareaVisible(true);
        transformerRef.current.nodes([]);
        layerRef.current.draw();
      });
      textRef.current = textNode;
      const transformer = new Konva.Transformer();
      transformerRef.current = transformer;
      layerRef.current.add(transformer);

      textNode.on("click", (e) => {
        e.cancelBubble = true;
        transformerRef.current.nodes([textNode]);
        layerRef.current.draw();
      });

      layerRef.current.add(textNode);
      layerRef.current.draw();

      setTextAdded(true);
    } else {
      // removeTextFromCanvas();
    }
    // else {
    //   const text = layerRef.current.findOne("Text");
    //   if (text) {
    //     layerRef.current.remove(text);
    //   }
    //   setTextAdded(false);
    //   layerRef.current.draw();
    // }
  };
  const removeTextFromCanvas = () => {
    const text = layerRef.current.findOne("Text");
    if (text) {
      layerRef.current.remove(text);
      setTextAdded(false); // Update state correctly
    }
    layerRef.current.draw();
  };
  const handleTextareaKeyDown = (e) => {
    if (e.key === "Enter") {
      // Update text content on Enter key press
      const text = layerRef.current.findOne("Text");
      if (text) {
        text.text(textContent);
        layerRef.current.draw();
        setTextareaVisible(false); // Hide textarea
      }
    }
  };
  const handleTextColorChange = (e) => {
    const newColor = e.target.value;
    setTextColor(newColor);
    if (textRef.current) {
      textRef.current.fill(newColor);
      layerRef.current.draw();
    }
  };
  const handleFontStyleChange = (e) => {
    const newFontStyle = e.target.value;
    setFontStyle(newFontStyle);
    if (textRef.current) {
      textRef.current.fontFamily(newFontStyle);
      layerRef.current.draw();
    }
  };
  const handleFontSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setFontSize(newSize);
    if (textRef.current) {
      textRef.current.fontSize(newSize);
      layerRef.current.draw();
    }
  };
  const handleToggleVideo = () => {
    if (!videoAdded) {
      const video = document.createElement("video");
      video.src = "/video.mp4";
      video.crossOrigin = "anonymous";
      video.loop = true; // Loop the video
      videoRef.current = video;

      const konvaVideo = new Konva.Image({
        x: 0,
        y: 0,
        image: video,
        width: 380,
        height: 380,
        draggable: false,
      });

      videoNodeRef.current = konvaVideo;
      layerRef.current.add(konvaVideo);
      konvaVideo.on("click", () => {
        transformerRef.current.nodes([konvaVideo]);
        layerRef.current.draw();
      });

      layerRef.current.add(konvaVideo);
      layerRef.current.draw();
      setCurrentVideo(konvaVideo);
      setVideoAdded(true);

      const anim = new Konva.Animation(() => {
        if (video.readyState === 4) {
          konvaVideo.image(video);
        }
      }, layerRef.current);

      animRef.current = anim;
      anim.start(); // Start animation

      video
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing the video:", error);
        });
      layerRef.current.children.forEach((child) => {
        if (child !== currentVideo) {
          child.zIndex(1); // Bring other elements to the front
        }
      });

      if (currentVideo) {
        currentVideo.zIndex(0); // Make sure the video is at the back
      }
    }
  };

  const handleTogglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const handleStopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      layerRef.current.draw();
    }
  };
  const moveText = (dx, dy) => {
    if (textRef.current) {
      const newX = textRef.current.x() + dx;
      const newY = textRef.current.y() + dy;
      textRef.current.position({ x: newX, y: newY });
      layerRef.current.draw();
    }
  };
  const handleMoveUp = () => moveText(0, -10);
  const handleMoveDown = () => moveText(0, 10);
  const handleMoveLeft = () => moveText(-10, 0);
  const handleMoveRight = () => moveText(10, 0);
  return (
    <section>
      <div className="header">
        <h2>KONVA ASSIGNMENT</h2>
      </div>
      <div className="canvas-container">
        <div className="actions">
          <div>
            <label>
              Text Color:
              <select
                value={textColor}
                onChange={handleTextColorChange}
                style={{ marginLeft: "10px" }}
              >
                <option value="#000000">Black</option>
                <option value="#FF0000">Red</option>
                <option value="#00FF00">Green</option>
                <option value="#0000FF">Blue</option>
                <option value="#FFFF00">Yellow</option>
                <option value="#FF00FF">Magenta</option>
                <option value="#00FFFF">Cyan</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Font Style:
              <select
                value={fontStyle}
                onChange={handleFontStyleChange}
                style={{ marginLeft: "10px" }}
              >
                <option value="Arial">Arial</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Font Size:
              <select
                value={fontSize}
                onChange={handleFontSizeChange}
                style={{ marginLeft: "10px" }}
              >
                <option value={16}>16</option>
                <option value={18}>18</option>
                <option value={20}>20</option>
                <option value={24}>24</option>
                <option value={30}>30</option>
                <option value={36}>36</option>
                <option value={48}>48</option>
              </select>
            </label>
          </div>
          <button onClick={handleAddImage}>
            {imageAdded ? "Added Image" : "Add Image"}
          </button>
          <div>
            <input
              type="text"
              placeholder="Enter Text"
              onChange={handleText}
              value={text}
            />
            <button onClick={handleAddText}>
              {textAdded ? "Text Added" : "Add Text"}
            </button>
          </div>
          <div>
            <button onClick={handleMoveUp}>Up</button>
            <button onClick={handleMoveDown}>Down</button>
            <button onClick={handleMoveLeft}>Left</button>
            <button onClick={handleMoveRight}>Right</button>
          </div>
          <div className="video-box">
            <button onClick={handleToggleVideo}>
              {videoAdded ? "Added Video" : "Add Video"}
            </button>

            {videoAdded && (
              <>
                <button onClick={handleTogglePlayPause}>
                  {isPlaying ? "Pause Video" : "Play Video"}
                </button>
                <button onClick={handleStopVideo}>Stop Video</button>
              </>
            )}
          </div>
        </div>
        <div className="canvas" ref={containerRef}>
          {/* add canvas */}
          {textareaVisible && (
            <input
              type="text"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              style={{
                position: "absolute",
                top: textareaPosition.y,
                left: textareaPosition.x,
                width: 150,
                height: 50,
                zIndex: 1000,
                padding: "5px",
                fontSize: "16px",
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default App;
