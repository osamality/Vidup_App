import { InputComponent } from 'components/input';
import { LinkComponent } from 'components/link';
import { IconButtonComponent } from 'components/icon-button';
import VerifyCodeComponent from 'components/verify-code';
import { DropDownPickerComponent } from 'components/dropdown-picker';
import inViewPort from './inViewPort';
import { _toast } from './toast';
import { TopHeader } from './topHeader';
import PostItem from './FlatList';
import statusBar from './statusBar';
import { ModalBtn } from './modalpressabletxt';
import { UnfollowConfirmation } from './unfollow-confirmation';
import { ConfirmationDialog } from './confirmation-dialog';
import { VideoDownloadModal } from './video-download';
import Profilethumb from './thumbnail-pic';
import FullScreenVideo from './full-screen-player';
import { renderSuggestions } from './mention-users';
import { renderWeeklyVideos } from './weeklyVideos';

export const Input = InputComponent;
export const Link = LinkComponent;
export const IconButton = IconButtonComponent;
export const VerifyCode = VerifyCodeComponent;
export const DropDownPicker = DropDownPickerComponent;
export const InViewPort = inViewPort;
export const _Toast = _toast;
export const Topheader = TopHeader;
export const Postitem = PostItem;
export const Statusbar = statusBar;
export const Modalbtn = ModalBtn;
export const UnfollowConfirm = UnfollowConfirmation;
export const ConfirmationModal = ConfirmationDialog;
export const ExportVideoModal = VideoDownloadModal;
export const ProfileThumb = Profilethumb;
export const FullScreenPlayer = FullScreenVideo;
export const _RenderSuggestions = renderSuggestions;
export const _RenderWeeklyVideos = renderWeeklyVideos;