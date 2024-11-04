// MUI
import { useTheme, Card } from '@mui/material';

// SCSS
import './NewsCard.scss';

const NewsCard = ({ news }: { news: any }) => {
    // styling
    const theme = useTheme();
    const customSpacing = (theme as any).customSpacing;

    const changeDate = (date: number): string => {
        const d = new Date(date).getMonth() + 1;
        return `${new Date(date).getDate().toString().padStart(2, '0')}/${d.toString().length < 2 ? '0' + d : d}/${new Date(date).getFullYear().toString().padStart(2, '0')}`;
    };

    return (
        <Card
            className="newsCard"
            data-testid={`news__item-${news?.id}`}
            data-type="news"
            variant="outlined"
            key={news?.id}
            style={{
                padding: customSpacing.m,
                marginRight: customSpacing.s,
                marginBottom: customSpacing.s,
            }}
        >
            <div className="upper">
                {news?.image !== '' ? (
                    <img src={news?.image} alt={news?.headline} />
                ) : (
                    <div className="upper-placeholder"></div>
                )}
                <div
                    className="upper-text"
                    style={{ marginLeft: customSpacing.s }}
                >
                    <p
                        className="upper-text__title"
                        style={{
                            margin: customSpacing.none,
                            fontSize: theme.typography.body1.fontSize,
                        }}
                    >
                        {news?.headline}
                    </p>
                    <p
                        className="upper-text__date"
                        style={{
                            margin: customSpacing.none,
                            marginTop: customSpacing.xs,
                            fontSize: theme.typography.body2.fontSize,
                        }}
                    >
                        {changeDate(news?.datetime * 1000)}
                    </p>
                </div>
            </div>
            <p
                className="lower-text__summary"
                style={{
                    margin: customSpacing.none,
                    marginTop: customSpacing.s,
                    fontSize: theme.typography.body1.fontSize,
                }}
            >
                {news?.summary}
            </p>
            <a
                className="lower-text__rm"
                style={{
                    marginTop: customSpacing.s,
                    fontSize: theme.typography.body1.fontSize,
                    color: theme.palette.text.primary,
                }}
                href={news?.url}
            >
                Read more
            </a>
        </Card>
    );
};

export default NewsCard;
