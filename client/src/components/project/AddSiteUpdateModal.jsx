import React, { useState } from "react";
import { toast } from "react-hot-toast";
import http from "../../api/http.js";
import ModalShell from "../common/ModalShell.jsx";

export default function AddSiteUpdateModal({ projectId, onClose, onSaved }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("placeholder");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      let mediaItems = [];
      
      if (files.length > 0) {
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);
          const uploadRes = await http.post("/uploads", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          mediaItems.push({ 
            url: uploadRes.data.url, 
            publicId: uploadRes.data.publicId 
          });
        }
      }

      await http.post("/updates", {
        project: projectId,
        title,
        category: category !== "placeholder" ? category : "",
        description,
        media: mediaItems
      });
      toast.success("Update added");
      onSaved();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Failed to add update.";
      toast.error(`${msg}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title="Add Site Update" onClose={onClose}>
      <form className="projectModalForm" onSubmit={handleSubmit}>
        <div className="projectModalFieldGroup">
          <label className="projectModalLabel" htmlFor="updateTitle">
            Title <span className="projectModalAsterisk">*</span>
          </label>
          <input
            id="updateTitle"
            className="projectModalInput"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Tiling work started"
            required
          />
        </div>

        <div className="projectModalFieldGroup">
          <label className="projectModalLabel" htmlFor="updateCategory">
            Phase / Category
          </label>
          <select
            id="updateCategory"
            className="projectModalSelect"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="placeholder" disabled>
              Select category
            </option>
            <option value="Foundation">Foundation</option>
            <option value="Tiling">Tiling</option>
            <option value="Painting">Painting</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Woodwork">Woodwork</option>
          </select>
        </div>

        <div className="projectModalFieldGroup">
          <label className="projectModalLabel" htmlFor="updateDescription">
            Description
          </label>
          <textarea
            id="updateDescription"
            className="projectModalTextarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of work done"
            rows={5}
          />
        </div>

        <div className="projectModalFieldGroup">
          <label className="projectModalLabel" htmlFor="siteUpdateFile">
            Photos &amp; Videos
          </label>

          <input
            id="siteUpdateFile"
            className="projectFileInputHidden"
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />

          <label className="projectFilePicker" htmlFor="siteUpdateFile">
            <span className="projectFilePickerButton">Choose Files</span>
            <span className="projectFilePickerText">
              {files.length > 0 ? `${files.length} files selected` : "No file chosen"}
            </span>
          </label>

          <div className="projectModalHelpText">
            Upload images (JPG, PNG) or videos (MP4, MOV)
          </div>
        </div>

        <footer className="projectModalFooter projectModalFooter--right">
          <button
            type="button"
            className="projectModalSecondaryButton"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="projectModalPrimaryButton" disabled={saving}>
            {saving ? "Adding..." : "Add Update"}
          </button>
        </footer>
      </form>
    </ModalShell>
  );
}
