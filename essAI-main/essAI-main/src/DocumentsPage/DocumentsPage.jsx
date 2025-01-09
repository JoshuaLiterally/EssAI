// src/DocumentsPage/DocumentsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiGrid, 
  FiList, 
  FiSearch, 
  FiPlus, 
  FiMoreVertical,
  FiStar,
  FiFolder,
  FiClock,
  FiType
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { DocumentService } from '../services/DocumentService';
import './DocumentsPage.css';

export default function DocumentsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('updated');
  const [selectedDocs] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.firebase_uid) {
      console.log('Fetching documents for user:', user.firebase_uid);
      fetchDocuments(user.firebase_uid);
    } else {
      console.log('User or firebase_uid is not defined');
    }
  }, [user]);

  useEffect(() => {
    filterDocuments(searchTerm, sortBy);
  }, [searchTerm, sortBy, documents]);

  const fetchDocuments = async (firebaseUid) => {
    try {
      console.log(`GET /firebase/${firebaseUid}`);
      const docs = await DocumentService.getDocumentsByFirebaseUid(firebaseUid);
      console.log('Fetched documents:', docs);
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const handleSort = (sort) => {
    setSortBy(sort);
  };



  const filterDocuments = (term, sort) => {
    let filtered = [...documents];
    
    if (term) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(term.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase()))
      );
    }
    
    // Sort documents
    filtered.sort((a, b) => {
      switch (sort) {
        case 'updated':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    
    setFilteredDocs(filtered);
  };

  const createNewDocument = async () => {
    try {
      const newDoc = await DocumentService.createDocument({
        title: 'Untitled Document',
        content: '',
        created_by: {
          user_id: user.userId // Use userId instead of firebaseUid
        },
        last_modified_by: {
          user_id: user.userId // Use userId instead of firebaseUid
        },
        document_type: 'text',
        is_template: false,
        is_deleted: false,
        tags: []
      });
      navigate(`/editor/${newDoc.document_id}`);
    } catch (error) {
      console.error('Failed to create document:', error);
    }
  };

  const openDocument = (docId) => {
    navigate(`/editor/${docId}`);
  };

  // Add cursor tracking for sidebar effect
  useEffect(() => {
    const sidebar = document.querySelector('.documents__sidebar');
    
    const handleMouseMove = (e) => {
      const rect = sidebar.getBoundingClientRect();
      const y = e.clientY - rect.top;
      sidebar.style.setProperty('--cursor-y', `${y}px`);
    };

    sidebar.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      sidebar.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="documents">
      <aside className="documents__sidebar">
        <div className="documents__logo">EssAI</div>
        <nav className="documents__nav">
          <button className="documents__nav-item documents__nav-item--active">
            <FiFolder /> All Documents
          </button>
          <button className="documents__nav-item">
            <FiStar /> Starred
          </button>
        </nav>
      </aside>

      <main className="documents__main">
        <header className="documents__header">
          <div className="documents__search-wrapper">
            <FiSearch className="documents__search-icon" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={handleSearch}
              className="documents__search"
            />
          </div>

          <div className="documents__actions">
            <div className="documents__sort">
              <button 
                className={`documents__sort-btn ${sortBy === 'updated' ? 'active' : ''}`}
                onClick={() => handleSort('updated')}
              >
                <FiClock /> Last Updated
              </button>
              <button 
                className={`documents__sort-btn ${sortBy === 'name' ? 'active' : ''}`}
                onClick={() => handleSort('name')}
              >
                <FiType /> Name
              </button>
            </div>

            <div className="documents__view-toggle">
              <button 
                className={`documents__view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <FiGrid />
              </button>
              <button 
                className={`documents__view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <FiList />
              </button>
            </div>

            <button onClick={createNewDocument} className="documents__new-btn">
              <FiPlus /> New Document
            </button>
          </div>
        </header>

        <div className={`documents__content ${viewMode === 'list' ? 'documents__list' : 'documents__grid'}`}>
          {viewMode === 'list' && (
            <div className="documents__list-header">
              <div className="documents__list-cell documents__list-cell--title">Title</div>
              <div className="documents__list-cell">Last Modified</div>
              <div className="documents__list-cell">Tags</div>
              <div className="documents__list-cell">Folder</div>
              <div className="documents__list-cell documents__list-cell--actions"></div>
            </div>
          )}
          
          {filteredDocs.map(doc => (
            <div 
              key={doc.document_id} 
              className={`${viewMode === 'list' ? 'documents__list-item' : 'document-card'} ${
                selectedDocs.includes(doc.document_id) ? 'document-card--selected' : ''
              }`}
              onClick={() => openDocument(doc.document_id)}
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="document-card__content">
                    <h3 className="document-card__title">{doc.title}</h3>
                    <div className="document-card__meta">
                      <span>Updated {new Date(doc.updated_at).toLocaleDateString()}</span>
                    </div>
                    <div className="document-card__tags">
                      {doc.tags.map(tag => (
                        <span key={tag} className="document-card__tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <button className="document-card__menu">
                    <FiMoreVertical />
                  </button>
                  {doc.starred && <div className="document-card__starred"><FiStar /></div>}
                </>
              ) : (
                <>
                  <div className="documents__list-cell documents__list-cell--title">
                    <div className="documents__list-title-group">
                      {doc.starred && <FiStar className="documents__list-star" />}
                      {doc.title}
                    </div>
                  </div>
                  <div className="documents__list-cell">
                    {new Date(doc.updated_at).toLocaleDateString()}
                  </div>
                  <div className="documents__list-cell">
                    <div className="documents__list-tags">
                      {doc.tags.map(tag => (
                        <span key={tag} className="document-card__tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="documents__list-cell">{doc.folder}</div>
                  <div className="documents__list-cell documents__list-cell--actions">
                    <button className="documents__list-menu">
                      <FiMoreVertical />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}