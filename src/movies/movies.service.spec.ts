import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { NotFoundException, Patch } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array', () => {
      const result = service.getAll();

      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('should return a movie', () => {
      service.create({
        title: 'TEST Movie',
        year: 2000,
        genres: ['TEST1', 'TEST2'],
      });

      const movie = service.getOne(0);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(0);
    });

    it('should throw 404 error', () => {
      try {
        service.getOne(999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual(`Movie with ID 999 not found`);
      }
    });
  });

  describe('deleteOne', () => {
    it('deletes a movie', () => {
      service.create({
        title: 'TEST Movie',
        year: 2000,
        genres: ['TEST1', 'TEST2'],
      });
      const allMovies = service.getAll();
      service.deleteOne(0);
      const afterDelete = service.getAll();

      expect(afterDelete.length).toBeLessThan(allMovies.length);
    });

    it('should return 404 error', () => {
      try {
        service.getOne(999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('create', () => {
    it('creates a movie', () => {
      const beforeCreate = service.getAll().length;
      service.create({
        title: 'TEST Movie',
        year: 2000,
        genres: ['TEST1', 'TEST2'],
      });

      const afterCreate = service.getAll().length;

      expect(afterCreate).toEqual(beforeCreate + 1);
    });
  });

  describe('update', () => {
    it('updates a movie', () => {
      service.create({
        title: 'TEST Movie',
        year: 2000,
        genres: ['TEST1', 'TEST2'],
      });

      const beforeUpdate = service.getOne(0);

      service.update(0, {
        year: 2021,
      });

      const afterUpdate = service.getOne(0);
      expect(afterUpdate.year).toEqual(2021);
    });

    it('should return 404 error', () => {
      try {
        service.getOne(999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
