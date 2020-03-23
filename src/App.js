import React from 'react';
import './App.css';

/**
 * SecureNotes
 * @class
 * @author Ryan Chen <ryan26tw@yahoo.com>
 * @summary A react component for the ProtonNote
 */
class SecureNotes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'view',
      notesList: [],
      originalActiveNote: {},
      activeNote: {
        title: '',
        content: ''
      },
      newNotes: '',
      activeNoteIndex: '',
      loadingState: false,
      loadingText: ''
    };
  }
  ryan = () => {

  }
  /**
   * Wait function to be triggered after certain time
   * @method
   * @param {number} delay - milliseconds
   * @returns promise
   */
  wait = async (delay) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), delay)
    });
  }
  /**
   * Mock for the encrypt data
   * @method
   * @param {string} data - data to be encrypted
   * @returns encrypted data
   */
  encrypt = async (data) => {
    await this.wait(500);
    return data;
  }
  /**
   * Mock for the decrypt data
   * @method
   * @param {string} data - data to be decrypted
   * @returns decrypted data
   */
  decrypt = async (data) => {
    await this.wait(500);
    return data;
  }
  /**
   * Handle button click for the app
   * @method
   * @param {string} type - button type ('new', 'cancel', 'edit', 'save', or 'delete')
   */
  handleBtnClick = (type) => {
    const {notesList, originalActiveNote, activeNote, newNotes, activeNoteIndex} = this.state;

    if (type === 'new') {
      this.setState({
        mode: 'edit',
        activeNote: {
          title: '',
          content: ''
        },
        newNotes: true,
        activeNoteIndex: ''
      })
    }

    if (type === 'cancel') {
      if (newNotes) {
        if (notesList.length > 0) {
          this.setState({
            originalActiveNote: JSON.parse(JSON.stringify(notesList[0])),
            activeNote: notesList[0],
            activeNoteIndex: 0
          });
        }
      } else {
        this.setState({
          activeNote: originalActiveNote
        });
      }

      this.setState({
        mode: 'view'
      });      
    }

    if (type === 'edit') {
      this.setState({
        mode: 'edit',
        newNotes: false
      });
    }

    if (type === 'save') {
      let tempNotesList = notesList;
      let noteIndex = activeNoteIndex;

      if (!activeNote.title) {
        alert('Note title is required');
        return;
      }

      this.setState({
        loadingState: true,
        loadingText: 'Saving...'
      });

      this.encrypt(activeNote.content).then(value => {
        let tempActiveNote = {...activeNote};
        tempActiveNote.content = value;

        if (newNotes) {
          tempNotesList.push(tempActiveNote);
          noteIndex = (notesList.length) - 1;
        } else {
          tempNotesList[activeNoteIndex] = tempActiveNote;
        }

        this.setState({
          mode: 'view',
          notesList: tempNotesList,
          originalActiveNote: JSON.parse(JSON.stringify(tempActiveNote)),
          activeNoteIndex: noteIndex,
          loadingState: false,
          loadingText: ''
        });
      });
    }

    if (type === 'delete') {
      const response = window.confirm('Are you sure you want to delete ' + (activeNote.title || 'this note') + '?');

      if (!response) {
        return;
      }

      let tempNotesList = notesList;
      tempNotesList.splice(activeNoteIndex, 1);

      if (tempNotesList.length === 0) {
        this.setState({
          activeNote: {
            title: '',
            content: ''
          },
          activeNoteIndex: ''
        });
      } else {
        this.setState({
          originalActiveNote: JSON.parse(JSON.stringify(notesList[0])),
          activeNote: notesList[0],
          activeNoteIndex: 0
        });
      }

      this.setState({
        mode: 'view',
        notesList: tempNotesList
      });
    }
  }
  /**
   * Open and set specific note data
   * @method
   * @param {number} i - index of the notes list
   */
  getNotesContent = (i) => {
    const {mode, notesList} = this.state;

    if (mode === 'edit') {
      return;
    }

    this.setState({
      loadingState: true,
      loadingText: 'Opening...'
    });

    this.decrypt(notesList[i].content).then(value => {
      let activeNote = notesList[i];
      activeNote.content = value;

      this.setState({
        originalActiveNote: JSON.parse(JSON.stringify(activeNote)),
        activeNote,
        activeNoteIndex: i,
        loadingState: false,
        loadingText: ''
      });
    });
  }
  /**
   * Change list styles based on user's actions
   * @method
   * @param {number} i - index of the notes list
   * @returns object with styles
   */
  getActiveStyle = (i) => {
    const {mode, activeNoteIndex} = this.state;

    if (activeNoteIndex === i) {
      return {'backgroundColor': '#46BBFB', 'color': '#fff'};
    } else {
      if (mode === 'edit') {
        return {'cursor': 'not-allowed'};
      }
    }
  }
  /**
   * Display notes list
   * @method
   * @param {number} i - index of the notes list
   * @returns HTML DOM
   */
  displayNotes = (val, i) => {
    return <li key={i} onClick={this.getNotesContent.bind(this, i)} style={this.getActiveStyle(i)}>{val.title}</li>
  }
  /**
   * Handle and set the input change
   * @method
   * @param {string} type - input type ('title' or 'content')
   * @param {object} event - event object
   */
  handleInputChange = (type, event) => {
    let tempActiveNote = {...this.state.activeNote};
    tempActiveNote[type] = event.target.value;

    this.setState({
      activeNote: tempActiveNote
    });
  }
  render() {
    const {mode, notesList, activeNote, newNotes, loadingState, loadingText} = this.state;

    return (
      <div id='secureNotesContainer'>
        <header>
          <button className='new' onClick={this.handleBtnClick.bind(this, 'new')} disabled={mode === 'edit'}>+ New note</button>
          <div className='app-title'>ProtonNote</div>
          <span className='copyright'>Developed by <a href='http://www.ryanchenweb.com' target='_blank' rel='noopener noreferrer'>Ryan Chen</a> for <a href='https://gist.github.com/mmso/9097e36918084fa8ab3b0bb823327201' target='_blank' rel='noopener noreferrer'>ProtonMail</a></span>
        </header>

        <div className='left-nav'>
          <ul>
            {notesList.map(this.displayNotes)}
          </ul>
        </div>

        <div className='right-content'>
          <header>
            {mode === 'view' &&
              <span>{activeNote.title}</span>
            }
            {mode === 'edit' &&
              <label>
                <input type='text' value={activeNote.title} onChange={this.handleInputChange.bind(this, 'title')} />
              </label>
            }
          </header>
          <div className='note-content'>
            {loadingState &&
              <div className='loader'>{loadingText}</div>
            }
            {mode === 'view' &&
              <span>{activeNote.content}</span>
            }
            {mode === 'edit' &&
              <label>
                <textarea value={activeNote.content} onChange={this.handleInputChange.bind(this, 'content')} />
              </label>
            }
          </div>
          <footer>
            {mode === 'view' && notesList.length > 0 &&
              <div className='view-mode'>
                <button className='edit' onClick={this.handleBtnClick.bind(this, 'edit')}>Edit</button>
              </div>
            }
            {mode === 'edit' &&
              <div className='edit-mode'>
                <button className='cancel' onClick={this.handleBtnClick.bind(this, 'cancel')}>Cancel</button>
                <button className='delete' onClick={this.handleBtnClick.bind(this, 'delete')} disabled={newNotes}>Delete</button>
                <button className='save' onClick={this.handleBtnClick.bind(this, 'save')}>Save</button>
              </div>
            }
          </footer>
        </div>
      </div>
    )
  }
}

export default SecureNotes;