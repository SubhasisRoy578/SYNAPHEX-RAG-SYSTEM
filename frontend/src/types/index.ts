export type DocumentStatus = 'queued' | 'processing' | 'ready' | 'failed' | 'deleting';

export type ExtractionMethod = 'text' | 'ocr' | 'mixed';

export interface DocumentItem {
  id: string;
  filename: string;
  fileExtension: string;
  fileSizeBytes: number;
  status: DocumentStatus;
  processingStage?: string;
  extractionMethod?: ExtractionMethod;
  pageCount?: number;
  chunkCount?: number;
  errorCode?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  description?: string;
  documentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CitationItem {
  id: string;
  documentId: string;
  documentTitle: string;
  pageNumber?: number;
  sectionTitle?: string;
  quoteText: string;
}

export interface MessageItem {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  status: 'complete' | 'failed' | 'pending';
  citations?: CitationItem[];
  createdAt: string;
}

export interface ConversationItem {
  id: string;
  title: string;
  scopeType: 'document' | 'collection' | 'selected_documents';
  documentId?: string;
  collectionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendHealth {
  status: 'ok' | 'error';
  app: string;
  environment: string;
  version: string;
  timestamp: string;
}
