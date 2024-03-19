// Import React
import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
// Import 3rd Party Packages
import SVG from 'react-inlinesvg';
import html2pdf from 'html2pdf.js';
// Import Context
import useAlarm from '../context/AlarmContext';
import { useModal } from '../context/ModalContext';
import { useNotesContent } from '../context/NoteContent';
import { useSideBarContent } from '../context/SidebarContext';
// Import Helpers
import { noteAPI } from '../api';
import handleSidebarResize from '../helpers/handleSidebarResize';
// Import Hooks
import useResponsive from '../hooks/useResponsive';
import OutsideDetector from '../hooks/outsideDetector';
import useStopScrolling from '../hooks/useStopScrolling';
import useAuthRedirect from '../hooks/useAuthRedirect';
// Import Components
import FormLoader from '../components/FormLoader';
import Editor from '../components/Editor';
import Button from '../components/Button';
import { Main } from '../components/layouts/Layouts';
import Spinner from '../components/Spinner';
// Import Images
import TrashIcon from '../../../../assets/images/reskin-images/icon--trash.svg';
import ExportIcon from '../../../../assets/images/reskin-images/icon--export.svg';
import ExportPurpleIcon from '../../../../assets/images/reskin-images/icon--export-purple.svg';
import MoreIcon from '../../../../assets/images/reskin-images/icon--more-horizontal.svg';
import RightChevron from '../../../../assets/images/reskin-images/icon--chevron-right.svg';
import EmptyNoteIcon from '../../../../assets/images/reskin-images/icon--frame.svg';
import NoNotesImg from '../../../../assets/images/reskin-images/img--no-notes-taken.png';
import PlayButton from '../../../../assets/images/reskin-images/icon--play-circle.svg';

/**
 * DestroyModal component displays a modal for confirming the deletion of a note.
 * @param {Object} note - The note object to be deleted.
 * @param {Function} setCurrentNote - Function to set the current note.
 * @returns {JSX.Element} DestroyModal component.
 */
const DestroyModal = ({ note, setCurrentNote }) => {
  const { behavior_title: behaviorTitle, id } = note;
  const { setAlarm } = useAlarm();
  const { setContent } = useModal();
  const queryClient = useQueryClient();

  const { mutate, isLoading: mutationIsLoading } = useMutation(
    () => noteAPI.destroyNote({ noteId: id }),
    {
      onSuccess: (data) => {
        setAlarm({ type: 'success', message: data.message });
        setContent({ title: null, body: null });
        setCurrentNote();
        queryClient.invalidateQueries('allNotes');
      },
      onSettled: (data, error) => {
        if (error) {
          setAlarm({ type: 'error', message: error.message });
        }
      }
    }
  );

  /**
   * Handles the form submission and triggers the note deletion.
   * @param {Event} event - The form submission event.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    mutate();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <h2 className=" font-semibold mb-3">Delete Note</h2>
        <p style={{ maxWidth: '34ch' }} className="text-center">
          Are you sure you want to delete your notes for{' '}
          <strong>{behaviorTitle}</strong>
        </p>
        <button
          type="submit"
          className=" font-semibold p-4 rounded-lg bg-red text-white mt-4 mb-2"
        >
          Delete Note
        </button>
      </form>
      {mutationIsLoading && <FormLoader />}
    </>
  );
};

/**
 * NoteDropDown component displays a dropdown menu for each note in the NotesMenu.
 * @param {Object} note - The note object.
 * @param {string} variant - The variant of the dropdown menu.
 * @param {Function} setCurrentNote - Function to set the current note.
 * @returns {JSX.Element} NoteDropDown component.
 */
const NoteDropDown = ({ note, variant, setCurrentNote, setGeneratingPDF }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { setContent } = useModal();

  const navigate = useNavigate();
  const viewBehaviorClickHandler = () => navigate(`/v2/program/${note?.module_id}/${note?.notable_id}`);

  /**
   * Exports the note to PDF format.
   */
  const exportToPDF = async () => {
    try {
      // Fetch the latest note content
      const latestNote = await noteAPI.getNoteContent({
        behaviorId: note.notable_id
      });

      const { behavior_title: behaviorTitle, module_title: moduleTitle } = note;
      const { content } = latestNote.note;

      // Format the content for PDF export
      const formattedContent = `
      <div style="padding: 20mm;">
        <h4 style="font-size: 16pt; font-family: Arial, sans-serif; margin-bottom: 10pt;">${moduleTitle}</h4>
        <h2 style="font-size: 24pt; font-family: Arial, sans-serif; margin-bottom: 20pt;">${behaviorTitle}</h2>
        ${content}
      </div>
    `;

      const opt = {
        margin: [0, 0, 0, 0],
        filename: `${behaviorTitle.toLowerCase()}-notes.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Generate and save the PDF
      html2pdf().from(formattedContent).set(opt).save();
    } catch (error) {
      console.error('Error fetching latest note content:', error);
    }
  };

  /**
   * Array of actions available in the dropdown menu.
   */
  const notesDropDownActions = [
    {
      Icon: ExportIcon,
      text: 'Export',
      action: () => exportToPDF()
    },
    {
      Icon: PlayButton,
      text: 'View Behavior',
      action: () => viewBehaviorClickHandler()
    },
    {
      Icon: TrashIcon,
      text: 'Delete Note',
      action: () => setContent(<DestroyModal setCurrentNote={setCurrentNote} note={note} />)
    }
  ];

  return (
    <OutsideDetector stateSetter={setShowDropdown} className="note-dropdown-container relative">
      <button
        type="button"
        style={{ minHeight: '32px', minWidth: '32px' }}
        onClick={() => setShowDropdown(!showDropdown)}
        className={`flex items-center justify-center rounded-full ${
          !showDropdown ? 'bg-transparent' : 'bg-link-purple note-dropdown-more--active'
        } ${variant === 'outlined' && 'border border-gray'}`}
      >
        <SVG src={MoreIcon} />
      </button>

      {showDropdown && (
        <div
          style={{
            boxShadow: '0px 10px 50px rgba(0, 0, 0, 0.2)',
            top: 'calc(100% + 8px)'
          }}
          className="overflow-hidden rounded-xl absolute pin-r z-20"
        >
          {notesDropDownActions.map(({ Icon, text, action }, index) => (
            <>
              <button
                key={crypto.randomUUID()}
                type="button"
                onClick={action}
                className="note-dropdown-menu-icon flex w-full items-center p-4 bg-white group"
                style={{ minWidth: '204px' }}
              >
                <div className="flex items-center">
                  <div
                    style={{ minHeight: '42px', minWidth: '42px' }}
                    className=" bg-grey-lighter rounded-2lg flex items-center justify-center group-hover:bg-purple"
                  >
                    <SVG src={Icon} />
                  </div>
                  <span className="font-sans font-bold text-charcoal text-left ml-4 text-sm whitespace-no-wrap">
                    {text}
                  </span>
                </div>
              </button>
              {index < notesDropDownActions.length - 1 && (
                <span className=" -px-8 h-px w-full bg-gray flex" />
              )}
            </>
          ))}
        </div>
      )}
    </OutsideDetector>
  );
};

/**
 * NotesMenu component displays the menu for organizing and accessing notes.
 * @param {Array} notesList - The list of notes.
 * @param {Object} currentNote - The current selected note.
 * @param {Function} setCurrentNote - Function to set the current note.
 * @returns {JSX.Element} NotesMenu component.
 */
const NotesMenu = ({ notesList, currentNote, setCurrentNote, setGeneratingPDF }) => {
  const { isTablet, isMobile } = useResponsive();

  /**
   * Exports all notes to a single PDF file.
   */
  const exportToPDF = async () => {
    try {
      setGeneratingPDF(true);
      const res = await noteAPI.getAllNotes();
      const allNotes = res?.notes;

      const formattedNotes = [];

      for (const note of allNotes) {
        const {
          behavior_title: behaviorTitle,
          module_title: moduleTitle,
          content
        } = note;

        const formattedContent = `
        <div style="padding: 20mm;">
          <h4 style="font-size: 16pt; font-family: Arial, sans-serif; margin-bottom: 10pt;">${moduleTitle}</h4>
          <h2 style="font-size: 24pt; font-family: Arial, sans-serif; margin-bottom: 20pt;">${behaviorTitle}</h2>
          ${content}
        </div>
        `;
        formattedNotes.push(formattedContent);
      }

      const opt = {
        margin: [0, 0, 0, 0],
        filename: 'admired-leadership-all-notes.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      let worker = html2pdf()
        .set(opt)
        .from(formattedNotes[0])

      if (formattedNotes.length > 1) {
        worker = worker.toPdf()

        // add each page individually to the PDF render process
        formattedNotes.slice(1).forEach((element, index) => {
          worker = worker
            .get('pdf')
            .then(pdf => {
              pdf.addPage()
            })
            .from(element)
            .toContainer()
            .toCanvas()
            .toPdf()
        })
      }

      worker = worker.save().then(() => {
        setGeneratingPDF(false);
      })
    } catch (error) {
      console.error('Error exporting all notes:', error);
    }
  };

  /**
   * Groups the notes by module and renders them in the menu.
   */
  const renderNotesByModule = () => {
    const groupedData = notesList?.reduce((result, item) => {
      if (!result[item.module_id]) {
        result[item.module_id] = [];
      }
      result[item.module_id].push(item);
      return result;
    }, {});

    if (!groupedData) {
      return null;
    }

    const sortedData = Object.entries(groupedData)
      .sort(([moduleIdA], [moduleIdB]) => moduleIdA - moduleIdB)
      .map(([moduleId, moduleItems]) => ({
        moduleId,
        moduleItems
      }));

    const sortedGroups = [
      ...sortedData.filter((group) => group.moduleId === '2'),
      ...sortedData.filter((group) => group.moduleId !== '2')
    ];

    return sortedGroups.map(({ moduleId, moduleItems }) => (
      <div key={moduleId} className="pb-8">
        <h3 className={`font-sans font-extrabold text-grey-dark text-sm mb-2 text-left ${isTablet ? 'pl-4' : ''}`}>
          {moduleId === '2' ? moduleItems[0].module_title : `MODULE ${moduleId}: ${moduleItems[0].module_title}`}
        </h3>
        <div style={{ gap: !isTablet && '16px' }} className="lg:relative flex flex-col lg:-m-10 lg:p-10">
          {moduleItems.map((note, index) => (
            <NoteMenuCard
              key={crypto.randomUUID()}
              note={note}
              last={index + 1 === moduleItems.length}
              currentNote={currentNote}
              setCurrentNote={setCurrentNote}
            />
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="w-full">
      <div className="flex mb-8 justify-between items-center">
        <h1 className="font-extrabold  text-charcoal text-5xl px-8 lg:px-0">
          Notes
        </h1>
        {(!isTablet || !isMobile) && notesList && notesList.length > 0 && (
          <button
            type="button"
            className="flex items-center"
            onClick={exportToPDF}
          >
            <SVG src={ExportPurpleIcon} />
            <span className="text-link-purple font-bold font-sans font-sm ml-2">
              Export All
            </span>
          </button>
        )}
      </div>

      <div className="flex flex-col pt-10">
        {renderNotesByModule()}
      </div>
    </div>
  );
};

/**
 * NoteMenuCard component displays a card for each note in the NotesMenu.
 * @param {Object} note - The note object.
 * @param {boolean} last - Indicates if it's the last note in the module.
 * @param {Object} currentNote - The current selected note.
 * @param {Function} setCurrentNote - Function to set the current note.
 * @returns {JSX.Element} NoteMenuCard component.
 */
const NoteMenuCard = ({ note, last, currentNote, setCurrentNote }) => {
  const {
    behavior_title: behaviorTitle,
    module_title: moduleTitle,
    notable_id: behaviorId,
    id
  } = note;

  const { isTablet } = useResponsive();
  const { setSidebarHeight } = useSideBarContent();
  const { setShowContentMobile } = useSideBarContent();

  useEffect(() => {
    setTimeout(() => {
      handleSidebarResize(setSidebarHeight);
    }, 500);
  }, []);

  /**
   * Handles the click event on the note card.
   * @param {Event} e - The click event.
   */
  const handleClick = (e) => {
    if (!e.target.closest('.note-dropdown-container')) {
      if (isTablet) setShowContentMobile(true);
      setCurrentNote({
        id,
        behavior_title: behaviorTitle,
        module_title: moduleTitle,
        notable_id: behaviorId
      });
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center justify-between p-6 bg-white border-t cursor-pointer ${
        isTablet && 'border-gray'
      } px-8 lg:mx-0 lg:p-6 ${last && 'border-b '}  ${
        currentNote?.notable_id === behaviorId
          ? 'lg:border-link-purple lg:bg-lightest-purple lg:border-2'
          : 'border-transparent lg:border-2'
      }`}
      style={{
        boxShadow: !isTablet && 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
        borderRadius: !isTablet && '32px'
      }}
    >
      <div className="flex flex-col items-start">
        <p className="font-sans font-extrabold text-charcoal text-left">
          {behaviorTitle}
        </p>
      </div>

      {isTablet ? (
        <SVG src={RightChevron} className="ml-1 " />
      ) : (
        <NoteDropDown note={note} setCurrentNote={setCurrentNote} />
      )}
    </div>
  );
};

/**
 * NotesContent component displays the content of the selected note.
 * @param {Object} currentNote - The current selected note.
 * @param {Function} setCurrentNote - Function to set the current note.
 * @returns {JSX.Element} NotesContent component.
 */
const NotesContent = ({ currentNote, setCurrentNote, setGeneratingPDF }) => {
  /**
   * Renders the content of the selected note in the editor.
   */
  const renderEditorContent = () => {
    const editorData = {
      id: currentNote?.notable_id
    };

    return (
      <>
        <div className="flex flex-col h-full w-full">
          <div className="content-above-editor flex flex-row w-full justify-between items-start lg:items-center">
            <span className="font-sans font-bold text-xl md:text-4xl text-left">
              {currentNote?.behavior_title}
            </span>

            <NoteDropDown
              note={currentNote}
              setCurrentNote={setCurrentNote}
              variant="outlined"
              setGeneratingPDF={setGeneratingPDF}
            />
          </div>
          <Editor behavior={editorData} />
        </div>
      </>
    );
  };

  /**
   * Renders the empty state when no note is selected.
   */
  const renderEmptyState = () => (
    <div className="w-full flex items-center justify-center">
      <div
        style={{ maxWidth: '460px' }}
        className="flex flex-col items-center justify-center"
      >
        <SVG src={EmptyNoteIcon} />
        <span className="text-charcoal font-sans font-bold text-3xl text-center">
          Select a note to view
        </span>
        <p className="text-charcoal font-sans text-center">
          Choose a note from the list on the left to view its contents, or
          create a new note to add to your collection.
        </p>
      </div>
    </div>
  );

  return (
    <div className="lg:w-full w-screen lg:w-auto fixed lg:static flex bg-white h-full">
      {!currentNote ? renderEmptyState() : renderEditorContent()}
    </div>
  );
};

/**
 * EmptyNote component displays the empty state when there are no notes.
 * @returns {JSX.Element} EmptyNote component.
 */
const EmptyNote = () => {
  const { isMobile } = useResponsive();

  const noNotes = (
    <div
      style={{ maxWidth: '460px' }}
      className="flex flex-col items-center justify-center"
    >
      <img src={NoNotesImg} alt="Listen to our podcast." />
      <span className="text-charcoal font-sans font-bold text-3xl text-center">
        Take notes while you watch
      </span>
      <p className="text-charcoal font-sans text-center">
        Notes taken in the notes tab will display here
      </p>
      <p>
        <Button to="/v2/program/2/15" className="mt-8 hidden xl:flex mr-3">
          View All Modules
        </Button>
      </p>
    </div>
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 92px)' }} className="w-full pt-8">
      <h1 className="font-extrabold  text-charcoal text-5xl px-8 lg:px-0">
        Notes
      </h1>

      <div
        style={{
          transform: isMobile ? 'translateY(100px)' : 'translateY(300px)'
        }}
        className="w-full flex items-center justify-center"
      >
        {noNotes}
      </div>
    </div>
  );
};

const NoNoteSidebar = () => (
  <h1 className="font-extrabold  text-charcoal text-5xl px-8 lg:px-0">
    Notes
  </h1>
);

const NoNoteContent = () => {
  const { isMobile, isTablet } = useResponsive();

  const styles = { transform: isMobile ? 'translateY(100px)' : 'translateY(300px)' };
  let classes = 'w-full flex items-center justify-center';

  if (isTablet) {
    classes = 'w-full flex items-center justify-center p-8';
  }

  return (
    <div style={styles} className={classes}>
      <div
        style={{ maxWidth: '460px' }}
        className="flex flex-col items-center justify-center"
      >
        <img src={NoNotesImg} alt="Listen to our podcast." />
        <span className="text-charcoal font-sans font-bold text-3xl text-center">
          Take notes while you watch
        </span>
        <p className="text-charcoal font-sans text-center">
          Notes taken in the notes tab will display here
        </p>
        <p>
          <Button to="/v2/program/2/15" className="mt-8 hidden xl:flex mr-3">
            View All Modules
          </Button>
        </p>
      </div>
    </div>
  );
};

/**
 * Notes component displays the main Notes page.
 * @returns {JSX.Element} Notes component.
 */
const Notes = () => {
  const { isTablet } = useResponsive();
  const { data: notesList, isLoading } = useQuery('allNotes', noteAPI.getAllNotes);
  const [currentNote, setCurrentNote] = useState();
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const { showContentMobile } = useSideBarContent(!!currentNote && isTablet);
  useAuthRedirect();

  useStopScrolling(showContentMobile);

  const noNote = notesList && notesList.notes.length === 0;

  const options = {
    content: noNote ? <NoNoteContent /> : <NotesContent currentNote={currentNote} setCurrentNote={setCurrentNote} notesList={notesList} setGeneratingPDF={setGeneratingPDF} />,
    sidebar: noNote ? <NoNoteSidebar /> : <NotesMenu notesList={notesList?.notes} currentNote={currentNote} setCurrentNote={setCurrentNote} setGeneratingPDF={setGeneratingPDF} />,
    isMenu: true
  };


  return (
    <>
      {generatingPDF && <Spinner />}
      <Main options={options} />
    </>
  );
};

export default Notes;
