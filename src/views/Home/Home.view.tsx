import './Home.scss';

import React from 'react';
import {useNavigate} from 'react-router-dom';

import {fetchAllJokes} from '../../api/joke.api';
import arrowDownPNG from '../../assets/arrow-down.png';
import arrowDownWEBP from '../../assets/arrow-down.webp';
import Button from '../../components/Button';
import CategoryList from '../../components/CategoryList';
import ImageWithFallback from '../../components/ImageWithFallback';
import JokeCard from '../../components/JokeCard';
import {retrieveJokes, storeJokes} from '../../joke.service';

const DEFAULT_PAGE_SIZE = 6;

const HomeView: React.FC = () => {
  const navigate = useNavigate();
  const [activeCateId, setActiveCateId] = React.useState<string | null>(null);
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);

  React.useEffect(() => {
    fetchAllJokes().then((results) => {
      if (results?.result?.length) {
        storeJokes(results.result);
      }
    });
  }, []);

  const jokesByCategory = React.useMemo(
    () =>
      activeCateId != null
        ? retrieveJokes(activeCateId).slice(0, pageSize)
        : [],
    [activeCateId, pageSize],
  );

  const isReachMaxLength = React.useMemo(() => {
    if (activeCateId == null) {
      return true;
    }
    return retrieveJokes(activeCateId).length <= pageSize;
  }, [activeCateId, pageSize]);

  React.useEffect(() => {
    setPageSize(DEFAULT_PAGE_SIZE);
  }, [activeCateId]);

  return (
    <main className="cj-home__main">
      <CategoryList
        onCategoryClick={(cateId) => {
          setActiveCateId(cateId);
        }}
      />

      <hr className="cj-home__hr-divider" />
      <div className="cj-joke-list__container">
        {activeCateId && (
          <div className="cj-joke-list__label__container">
            <span className="cj-joke-list__label">{activeCateId}</span>
          </div>
        )}

        <div className="cj-joke-list">
          {jokesByCategory.map((joke) => (
            <JokeCard
              mode="preview"
              key={joke.id}
              title={joke.value.split(/\s/)?.slice(0, 3)?.join(' ')}
              description={joke.value}
              onSeeStatsClick={() => navigate('/joke/' + joke.id)}
              // iconUrl={joke.icon_url}
            />
          ))}
        </div>
        {isReachMaxLength ? (
          <div className="cj-joke-list__no-more">No more jokes :(</div>
        ) : (
          <Button
            variant="outlined"
            onClick={() => {
              setPageSize((prev) => prev + 6);
            }}
            rightIcon={
              <ImageWithFallback
                src={arrowDownWEBP}
                fallback={arrowDownPNG}
                alt="view more button"
              />
            }>
            view more
          </Button>
        )}
      </div>
    </main>
  );
};

export default HomeView;
