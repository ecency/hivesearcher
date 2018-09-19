import React, {Component} from "react";
import ReactHtmlParser from "react-html-parser";

import PropTypes from "prop-types";
import {FormattedNumber, FormattedRelative} from "react-intl";
import AuthorAvatar from "../author-avatar";
import proxifyImageSrc from "../../utils/proxify-image-src";
import linkify from "../../utils/linkify";
import noImg from "../../img/noimage.png";
import fallBackImg from "../../img/fallback.png";
import commentImg from '../../img/comment.png';
import markedHtml from "../../utils/marked-html";

class ListItem extends Component {

    render() {

        const {entry} = this.props;

        const isComment = entry.depth > 0;

        const authorRep = parseFloat(entry.author_rep).toFixed(0);
        const img = isComment ? commentImg : ( entry.img_url ? proxifyImageSrc(entry.img_url) : noImg);
        const title = entry.title_marked ? ReactHtmlParser(markedHtml(entry.title_marked)) : markedHtml(entry.title);
        const body = entry.body_marked ? ReactHtmlParser(markedHtml(entry.body_marked)) : markedHtml(entry.body);
        const payout = parseFloat(entry.payout);
        const postLink = linkify(entry.author, entry.permlink);

        return (
            <div className={`list-item ${isComment ? 'comment-item' : ''}`}>
                <div className="item-header">
                    <div className="author-avatar">
                        <AuthorAvatar user={entry.author} size="small"/>
                    </div>
                    <div className="author">{entry.author}{' '}
                        <span className="author-reputation">{authorRep}</span>
                    </div>
                    <span className="category">
                        {entry.category}
                    </span>
                    <span className="date">
                        <FormattedRelative value={entry.created_at}/>
                      </span>
                </div>
                <div className="item-body">
                    <a className="item-image" href={postLink} target="_blank">
                        <img
                            src={img}
                            alt=""
                            onError={e => {
                                e.target.src = fallBackImg;
                            }}
                        />
                    </a>
                    <div className="item-summary">
                        <a className="item-title" href={postLink} target="_blank">{title}</a>
                        <a className="item-body" href={postLink} target="_blank">{body}</a>
                    </div>
                    <div className="item-controls">
                        <span className={`post-total`}>
                            $ <FormattedNumber value={payout}/>
                        </span>
                        <span className="voters">
                            <i className="mi">people</i> {entry.total_votes}
                        </span>
                        <span className="comments">
                            <i className="mi">comment</i> {entry.children}
                        </span>
                        <span className="app">{entry.app}</span>
                    </div>
                </div>
            </div>
        );
    }
}

ListItem.propTypes = {
    entry: PropTypes.object.isRequired
};

export default ListItem