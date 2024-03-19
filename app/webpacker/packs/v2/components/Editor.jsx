import React, { useState, useEffect, useCallback, useContext } from 'react';
import debounce from 'lodash.debounce';
import { useQuery } from 'react-query';
import ReactQuill from 'react-quill';
import { csrfToken } from '@rails/ujs';
import SVG from 'react-inlinesvg';
import { createRoot } from 'react-dom/client';
import {
  EditorBoldIcon,
  EditorChevronDownIcon,
  EditorImageIcon,
  EditorItalicIcon,
  EditorLinkIcon,
  EditorListIcon,
  EditorUnderlineIcon
} from '../helpers/iconsRaw';
import { noteAPI } from '../api';
import useAuth from '../context/AuthContext';
import useResponsive from '../hooks/useResponsive';
import exportNoteToPDF from '../helpers/exportNoteToPDF';
import ExportPurpleIcon from '../../../../assets/images/reskin-images/icon--export-purple.svg';
import ExportGrayIcon from '../../../../assets/images/reskin-images/icon--export-gray.svg';
import handleSidebarResize from '../helpers/handleSidebarResize';
import { useSideBarContent } from '../context/SidebarContext';

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'X-CSRF-Token': csrfToken()
};

const containsTextInHtmlTags = (inputString) => {
  // Create a temporary div element to parse the input string
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = inputString;

  // Use a recursive function to check for text content
  function hasText(element) {
    if (element.nodeType === Node.TEXT_NODE) {
      // Check if the text content is non-empty (excluding spaces)
      return /\S/.test(element.textContent);
    }
    for (const child of element.childNodes) {
      if (hasText(child)) {
        return true;
      }
    }
    return false;
  }

  // Start checking from the temporary div element
  return hasText(tempDiv);
}

const Editor = ({ behavior, className, fixedHeight, module }) => {
  const [currentNote, setCurrentNote] = useState();
  const [emptyNote, setEmptyNote] = useState(true);
  const [noteContent, setNoteContent] = useState();
  const [saving, setSaving] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const { isMobile } = useResponsive();
  const { setSidebarHeight } = useSideBarContent();

  const { userData } = useAuth();

  const { data, isLoading, error, refetch } = useQuery(
    ['noteContent', behavior?.id, userData?.id],
    () => noteAPI.getNoteContent({ behaviorId: behavior?.id }),
    {
      enabled: !!behavior?.id
    }
  );

  useEffect(() => {
    if (data?.note) {
      const containsText = containsTextInHtmlTags(data?.note?.content);
      setCurrentNote(data?.note);
      setNoteContent(data?.note?.content);

      if(containsText) {
        setEmptyNote(false);
      } else {
        setEmptyNote(true);
      }
    } else {
      setCurrentNote(null);
      setNoteContent(null);
    }
  }, [data?.note]);

  useEffect(() => {
    if (behavior?.id) {
      refetch();
    }
  }, [behavior?.id, refetch]);
  const saveNote = useCallback(async () => {
    const type = currentNote?.id === undefined ? 'new' : 'update';
    let path = '';
    let body = '';

    if (type === 'new') {
      path = '/api/v2/notes/create_note';
      body = JSON.stringify({
        content: noteContent,
        behavior_id: behavior?.id
      });
    }

    if (type === 'update') {
      path = '/api/v2/notes/update_note';
      body = JSON.stringify({ content: noteContent, id: currentNote?.id });
    }

    const res = await fetch(path, {
      method: 'POST',
      headers,
      body
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message);
    }

    // Update the currentNote state when a new note is created
    if (type === 'new') {
      setCurrentNote(result.note);
    }


    setSaving(false);
  }, [currentNote, behavior, noteContent]);

  const debouncedSaveNote = useCallback(debounce(saveNote, 1000), [saveNote]);

  const [noteModified, setNoteModified] = useState(false);

  const handleEditorChange = (value) => {
    handleSidebarResize(setSidebarHeight);
    setNoteContent(value);
    setNoteModified(true);
    setSaving(true);
    setEmptyNote(false);
    debouncedSaveNote();
    currentNote.content = value;
    setCurrentNote(currentNote);

    const valueHasText = containsTextInHtmlTags(value);

    if(valueHasText) {
      setEmptyNote(false);
    } else {
      setEmptyNote(true);
    }
  };

  useEffect(() => {
    if (noteContent !== undefined && noteModified) {
      debouncedSaveNote();
    }
    return () => debouncedSaveNote.cancel();
  }, [noteContent, noteModified, debouncedSaveNote]);

  const boxStyle = {
    width: '100%',
    height: '100%'
  };

  const [toolbar, setToolbar] = useState(null);

  useEffect(() => {
    const toolbarElement = document.querySelector('.ql-toolbar');
    if (toolbarElement) {
      setToolbar(toolbarElement);
    }
  }, []);

  useEffect(() => {
    if (!module) {
      return;
    }

    if (!toolbar) {
      return;
    }

    if (currentNote) {
      currentNote.behavior_title = behavior?.title;
      currentNote.module_title = module?.title;
    }
  }, [toolbar, currentNote, emptyNote]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'bullet' }],
      ['link', 'image']
    ]
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
    'link',
    'image'
  ];
  const icons = ReactQuill.Quill.import('ui/icons');

  icons.bold = EditorBoldIcon;
  icons.italic = EditorItalicIcon;
  icons.image = EditorImageIcon;
  icons.link = EditorLinkIcon;
  icons.underline = EditorUnderlineIcon;
  icons.list.bullet = EditorListIcon;
  icons.header[1] = EditorChevronDownIcon;
  icons.header[2] = '';

  const handleFocus = () => {
    setToolbarVisible(true);
  };

  const handleBlur = () => {
    setToolbarVisible(false);
  };

  const quillClassName = `custom-quill ${
    toolbarVisible ? 'toolbar-visible' : ''
  } ${isMobile ? 'mobile-padding' : ''}`;

  return (
    <form
      style={{ maxHeight: fixedHeight && isMobile ? fixedHeight : 'auto' }}
      onSubmit={(e) => e.preventDefault()}
      className={className}
    >
      <div className="form-group h-full">
        <ReactQuill
          className={quillClassName}
          style={boxStyle}
          theme="snow"
          value={noteContent}
          modules={modules}
          formats={formats}
          onChange={handleEditorChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Write here..."
        />
      </div>
      <div className="w-full py-3" style={{borderTop: '1px solid #ccc'}}>
        {emptyNote ? (
          <button className="flex items-center mb-3" type="button" style={{float: 'right', pointerEvents: 'none', color: '#dfdfe0'}} disabled="true">
            <div>
              <SVG src={ExportGrayIcon} />
            </div>
            <span className="font-bold font-sans font-sm ml-2">Export Note</span>
          </button>
        ) : (
          <button className="flex items-center mb-3" type="button" style={{float: 'right'}} onClick={() => exportNoteToPDF(currentNote)}>
            <div>
              <SVG src={ExportPurpleIcon} />
            </div>
            <span className="text-link-purple font-bold font-sans font-sm ml-2">Export Note</span>
          </button>
        )}
      </div>
    </form>
  );
};

export default Editor;
