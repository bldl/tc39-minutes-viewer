import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { DELEGATES, Delegate } from './delegates_list';

interface EssentialProps {
  link: string | null;
}

// Modal component for displaying comments
const Modal: React.FC<{ comments: string[]; onClose: () => void }> = ({
  comments,
  onClose,
}) => {
  const theme = useTheme();
  if (comments.length === 0) return null; // Do not display modal if there are no comments

  return (
    <div
      style={{
        position: "fixed",
        top: "28%",
        transform: "translate(-5.5%, -1%)",
        backgroundColor: theme.palette.mode === "light" ? "white" : "#242424",
        padding: "20px",
        zIndex: 1000,
        border: "1px solid #ccc",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      width: "68.7vh",
      height: "69.5vh",
      borderRadius: "20px",
      overflowY: "auto",
      maxWidth: "40%",
        maxHeight: "70%",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "sticky",
          top: 0,
          left: 500,
          padding: "10px",
          fontSize: "25px",
          background: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        <CloseIcon style={{ color: "black" }}></CloseIcon>
      </button>
      <h3>Comments:</h3>
      {comments.map((comment, index) => (
        <p key={index}>{comment}</p>
      ))}
    </div>
  );
};

const DelegatesComponent: React.FC<EssentialProps> = ({ link }) => {
  const [initials, setInitials] = useState<string[]>([]);
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [markdownContent, setMarkdownContent] = useState<string>("");
const [showModal, setShowModal] = useState(false);

useEffect(() => {
  const fetchFromMarkdown = async () => {
    if (link) {
      try {
        const response = await fetch(link);
          const text = await response.text();
          setMarkdownContent(text);

          const regex = /\b[A-Z]{2,}\b(?=:)/g;
          const matches = text.match(regex);

          if (matches) {
            const uniqueInitials = Array.from(new Set(matches));
            setInitials(uniqueInitials);
          }
        } catch (error) {
          console.error("Error loading Markdown file:", error);
        }
      }
    };

    fetchFromMarkdown();
  }, [link]);

  const handlePersonClick = (personInitials: string) => {
    // Add a unique marker at the end of the content to ensure the last comment is captured
    const contentWithEndMarker = `${markdownContent} END_OF_CONTENT:`;

    // This regex matches the initials followed by any content until another set of initials or the end marker
    const commentRegex = new RegExp(
      `${personInitials}:.*?(?=(\\b[A-Z]{2,}\\b(?=:))|END_OF_CONTENT:)`,
      "gs",
    );
    const comments = Array.from(
      contentWithEndMarker.matchAll(commentRegex),
      (m) => m[0],
    );

    setSelectedComments(comments);
    setShowModal(true); // Show the modal when a person is clicked
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
  };

  return (
    <div>
      <h2>
        {initials.length > 0
          ? "Participants"
          : "Select an MD file from the navigation bar to display the people list."}
      </h2>
      <ul>
        {DELEGATES.filter((delegate) =>
          initials.includes(delegate.credentials),
        ).map((delegate, index) => (
          <li
            key={index}
            onClick={() => handlePersonClick(delegate.credentials)}
            style={{ cursor: "pointer" }}
          >
            {`${delegate.name} (${delegate.credentials})`}
          </li>
        ))}
      </ul>
      {showModal && (
        <Modal comments={selectedComments} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default DelegatesComponent;

// Used a python script to extract the delegates from the txt file and convert it to this format
// here is the script in case we need to update the list of delegates.

// with open('path-to-delegates.txt', 'r', encoding='utf-8') as file:
//     lines = file.readlines()

// for line in lines:
//     line = line.strip()
//     if line:
//         name, credentials = line.rsplit(' ', 1)
//         credentials = credentials[1:-1]
//         print(f"{{ name: '{name}', credentials: '{credentials}' }},")
